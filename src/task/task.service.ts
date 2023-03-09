import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async getTasks(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async getTask(id: string) {
    try {
      return await this.taskModel.findById(id).exec();
    } catch (error) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    try {
      return new this.taskModel(data).save();
    } catch (error) {
      console.log(error);
    }
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.taskModel.findOneAndUpdate(
        { _id: id },
        { ...data },
        { new: true },
      );

      return task;
    } catch (error) {}
  }

  async deleteTask(id: string): Promise<any> {
    try {
      return await this.taskModel.deleteOne({ _id: id });
    } catch (error) {}
  }
}
