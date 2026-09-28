import { CommandRunner, SubCommand } from 'nest-commander';
import { COMMAND } from './command.enum';
import { TaskService } from '../task.service';
import { TaskStatus, TaskStatusValues } from '../task.schema';

@SubCommand({
  name: COMMAND.LIST,
  arguments: '',
  aliases: ['l'],
})
export class TaskListCommand extends CommandRunner {
  constructor(private readonly taskService: TaskService) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    const [mode] = passedParams;
    if (TaskStatusValues.includes(mode as TaskStatus)) {
      console.log(await this.taskService.list(mode as TaskStatus));
      return;
    }

    console.log(await this.taskService.list());
  }
}
