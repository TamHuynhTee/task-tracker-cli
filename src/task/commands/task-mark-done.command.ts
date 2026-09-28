import { CommandRunner, SubCommand } from 'nest-commander';
import { COMMAND } from './command.enum';
import { TaskService } from '../task.service';
import { TaskStatus } from '../task.schema';

@SubCommand({
  name: COMMAND.MARK_DONE,
  aliases: ['md'],
})
export class TaskMarkDoneCommand extends CommandRunner {
  constructor(private readonly taskService: TaskService) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    const [id] = passedParams;

    if (!(typeof id === 'string' && id !== '')) {
      console.error('Invalid id');
    }

    const success = await this.taskService.update(id, {
      status: TaskStatus.DONE,
    });
    if (success) console.log(`Task marked done successfully (ID: ${id})`);
  }
}
