import { CommandRunner, SubCommand } from 'nest-commander';
import { COMMAND } from './command.enum';
import { TaskService } from '../task.service';

@SubCommand({
  name: COMMAND.CREATE,
  aliases: ['a'],
})
export class TaskCreateCommand extends CommandRunner {
  constructor(private readonly taskService: TaskService) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    const [desc] = passedParams;
    if (!(typeof desc === 'string' && desc !== '')) {
      console.error('Invalid description');
    }
    const id = await this.taskService.create(desc);
    if (typeof id === 'string' && id !== '') {
      console.log(`Task added successfully (ID: ${id})`);
    }
  }
}
