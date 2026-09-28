import { CommandRunner, SubCommand } from 'nest-commander';
import { COMMAND } from './command.enum';
import { TaskService } from '../task.service';
import { TaskStatus } from '../task.schema';

@SubCommand({
  name: COMMAND.MARK_IN_PROGRESS,
  aliases: ['mip'],
})
export class TaskMarkInProgressCommand extends CommandRunner {
  constructor(private readonly taskService: TaskService) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    const [id] = passedParams;

    if (!(typeof id === 'string' && id !== '')) {
      console.error('Invalid id');
    }

    const success = await this.taskService.update(id, {
      status: TaskStatus.IN_PROGRESS,
    });
    if (success) console.log(`Task mark in progress successfully (ID: ${id})`);
  }
}
