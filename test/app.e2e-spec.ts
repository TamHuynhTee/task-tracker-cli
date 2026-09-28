import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import type { ITask } from '../src/task/task.schema';

const execFileAsync = promisify(execFile);
const projectRoot = resolve(__dirname, '..');

describe('Task CLI (e2e)', () => {
  let workingDirectory: string;

  beforeEach(async () => {
    workingDirectory = await mkdtemp(join(tmpdir(), 'task-tracker-e2e-'));
  });

  afterEach(async () => {
    if (workingDirectory) {
      await rm(workingDirectory, { recursive: true, force: true });
    }
  });

  async function runCommand(...args: string[]): Promise<string> {
    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      [
        '-r',
        require.resolve('ts-node/register'),
        join(projectRoot, 'src/main.ts'),
        'task-cli',
        ...args,
      ],
      {
        cwd: workingDirectory,
        env: {
          ...process.env,
          TS_NODE_PROJECT: join(projectRoot, 'tsconfig.json'),
        },
        timeout: 15000,
      },
    );

    expect(stderr).toBe('');
    return stdout;
  }

  async function readTasks(): Promise<ITask[]> {
    return JSON.parse(
      await readFile(join(workingDirectory, 'data.json'), 'utf8'),
    );
  }

  it('creates, updates, filters, completes, and deletes a persisted task', async () => {
    expect((await runCommand('list')).trim()).toBe('[]');

    const added = await runCommand('add', 'Buy groceries');
    const tasks = await readTasks();
    expect(tasks).toHaveLength(1);

    const task = tasks[0];
    expect(task).toEqual({
      id: expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      ),
      description: 'Buy groceries',
      status: 'todo',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(Number.isNaN(Date.parse(task.createdAt))).toBe(false);
    expect(Number.isNaN(Date.parse(task.updatedAt))).toBe(false);
    expect(added).toContain(`Task added successfully (ID: ${task.id})`);

    await runCommand('update', task.id, 'Buy groceries and cook dinner');
    expect(await readTasks()).toEqual([
      expect.objectContaining({
        id: task.id,
        description: 'Buy groceries and cook dinner',
        status: 'todo',
        createdAt: task.createdAt,
      }),
    ]);

    await runCommand('mark-in-progress', task.id);
    expect((await readTasks())[0].status).toBe('in-progress');
    expect(await runCommand('list', 'in-progress')).toContain(task.id);
    expect((await runCommand('list', 'todo')).trim()).toBe('[]');

    await runCommand('mark-done', task.id);
    expect((await readTasks())[0].status).toBe('done');
    expect(await runCommand('list', 'done')).toContain(task.id);
    expect((await runCommand('list', 'in-progress')).trim()).toBe('[]');

    await runCommand('delete', task.id);
    expect(await readTasks()).toEqual([]);
    expect((await runCommand('list')).trim()).toBe('[]');
  }, 60000);
});
