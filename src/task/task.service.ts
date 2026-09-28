import { Injectable } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { ITask, TaskStatus } from './task.schema';

@Injectable()
export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  async list(mode?: TaskStatus): Promise<Array<ITask>> {
    return await this.repository.list(mode);
  }

  async create(desc: string): Promise<string> {
    return await this.repository.create(desc);
  }

  async update(
    id: string,
    content: Partial<Pick<ITask, 'description' | 'status'>>,
  ): Promise<boolean> {
    return await this.repository.update(id, content);
  }

  async delete(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
