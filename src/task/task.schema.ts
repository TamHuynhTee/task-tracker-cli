import { BadRequestException } from '@nestjs/common';
import { v4 } from 'uuid';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export const TaskStatusValues = Object.values(TaskStatus);

export class Task {
  id: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;

  constructor(description: string) {
    if (!description)
      throw new BadRequestException('Task description is empty');
    this.id = v4();
    this.description = description;
    this.status = TaskStatus.TODO;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  toJSON(): ITask {
    return {
      id: this.id,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export interface ITask {
  id: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}
