import { CommandRunner, SubCommand } from 'nest-commander';
import { COMMAND } from './command.enum';
import { TaskService } from '../task.service';

@SubCommand({
  name: COMMAND.DELETE,
  aliases: ['d'],
})
export class TaskDeleteCommand extends CommandRunner {
  constructor(private readonly taskService: TaskService) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    const [id] = passedParams;

    if (!(typeof id === 'string' && id !== '')) {
      console.error('Invalid id');
    }

    const success = await this.taskService.delete(id);
    if (success) console.log(`Task deleted successfully (ID: ${id})`);
  }
}
