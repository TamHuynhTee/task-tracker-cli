import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskCommand } from './commands/task.command';
import { TaskRepository } from './task.repository';

@Module({
  providers: [
    TaskService,
    TaskRepository,
    ...TaskCommand.registerWithSubCommands(),
  ],
})
export class TaskModule {}
