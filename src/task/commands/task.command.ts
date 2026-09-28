import { Command, CommandRunner } from 'nest-commander';
import { TaskCreateCommand } from './task-create.command';
import { TaskListCommand } from './task-list.command';
import { TaskUpdateCommand } from './task-update.command';
import { TaskDeleteCommand } from './task-delete.command';
import { TaskMarkDoneCommand } from './task-mark-done.command';
import { TaskMarkInProgressCommand } from './task-mark-in-progress.command';

const COMMAND_NAME = 'task-cli';

@Command({
  name: COMMAND_NAME,
  description: 'Task tracking commands',
  subCommands: [
    TaskCreateCommand,
    TaskListCommand,
    TaskUpdateCommand,
    TaskDeleteCommand,
    TaskDeleteCommand,
    TaskDeleteCommand,
    TaskMarkDoneCommand,
    TaskMarkInProgressCommand,
  ],
})
export class TaskCommand extends CommandRunner {
  constructor() {
    super();
  }

  async run(): Promise<void> {
    console.log('Running task cli');
  }
}
