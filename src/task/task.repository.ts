import { Injectable } from '@nestjs/common';
import { ITask, Task, TaskStatus, TaskStatusValues } from './task.schema';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class TaskRepository {
  private data_path: string;

  constructor() {
    this.data_path = path.join(process.cwd(), 'data.json');
  }

  private async readOrCreateFile(path: string) {
    try {
      const data = await fs.readFile(path, {
        encoding: 'utf8',
        flag: 'a+',
      });

      return data || '[]';
    } catch (error) {
      console.error('Internal error:', error);
    }
  }

  private async writeFile(path: string, content: string) {
    try {
      await fs.writeFile(path, content, {
        encoding: 'utf8',
      });
    } catch (error) {
      console.error('Internal error:', error);
    }
  }

  async list(status?: TaskStatus): Promise<Array<ITask>> {
    try {
      const raw_json = await this.readOrCreateFile(this.data_path);
      const json: Array<ITask> = JSON.parse(raw_json);

      if (TaskStatusValues.includes(status)) {
        return json.filter((v) => v.status === status);
      }

      return json;
    } catch (error) {
      console.log(error);
    }
  }

  async create(desc: string) {
    const task = new Task(desc);

    try {
      const raw_json = await this.readOrCreateFile(this.data_path);
      const json: Array<ITask> = JSON.parse(raw_json);
      json.push(task.toJSON());

      await this.writeFile(this.data_path, JSON.stringify(json));

      return task.id;
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    id: string,
    content: Partial<Pick<ITask, 'description' | 'status'>>,
  ): Promise<boolean> {
    try {
      const raw_json = await this.readOrCreateFile(this.data_path);
      const json: Array<ITask> = JSON.parse(raw_json);

      const taskIdx = json.findIndex((v) => v.id === id);

      if (taskIdx < 0) throw Error(`Task with ID '${id}' not found`);

      json[taskIdx] = {
        ...json[taskIdx],
        ...content,
      };

      await this.writeFile(this.data_path, JSON.stringify(json));

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const raw_json = await this.readOrCreateFile(this.data_path);
      const json: Array<ITask> = JSON.parse(raw_json);

      const new_json = json.filter((v) => v.id !== id);

      await this.writeFile(this.data_path, JSON.stringify(new_json));

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
