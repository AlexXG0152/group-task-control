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

  async updateTask(
    id: string,
    data: any,
    finishedUserID: string,
  ): Promise<Task> {
    try {
      const originTask = await this.getTask(id);
      const query = {};

      for (const key in originTask.steps[data.stepNumber - 1]) {
        // if (
        //   originTask.steps[data.stepNumber - 1][key] &&
        //   originTask.steps[data.stepNumber - 1][key] !== data[key]
        // ) {
        query[key] = originTask.steps[data.stepNumber - 1][key] || data[key];
        // }
      }

      const updatedTask = await this.taskModel.findOneAndUpdate(
        { _id: id, 'steps.stepNumber': data.stepNumber },
        { $set: { 'steps.$': { ...query, finishedUserID } } },
        { upsert: true, useFindAndModify: false },
      );

      return updatedTask;
    } catch (error) {}
  }

  async deleteTask(id: string): Promise<any> {
    try {
      return await this.taskModel.deleteOne({ _id: id });
    } catch (error) {}
  }
}
