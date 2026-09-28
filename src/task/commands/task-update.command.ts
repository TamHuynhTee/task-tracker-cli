import { CommandRunner, SubCommand } from 'nest-commander';
import { COMMAND } from './command.enum';
import { TaskService } from '../task.service';

@SubCommand({
  name: COMMAND.UPDATE,
  aliases: ['u'],
})
export class TaskUpdateCommand extends CommandRunner {
  constructor(private readonly taskService: TaskService) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    const [id, desc] = passedParams;

    if (!(typeof id === 'string' && id !== '')) {
      console.error('Invalid id');
    }

    if (!(typeof desc === 'string' && desc !== '')) {
      console.error('Invalid description');
    }

    const success = await this.taskService.update(id, { description: desc });
    if (success) console.log(`Task updated successfully (ID: ${id})`);
  }
}
