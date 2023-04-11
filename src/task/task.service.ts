import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { Organization } from 'src/organization/schemas/organization.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getTasks(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async getTask(id: string, user: string) {
    try {
      const userData = await this.userModel.findById(user).exec();
      if (userData.role !== 'user') {
        return await this.taskModel.findById(id).exec();
      } else {
        const task = await this.taskModel.findById(id).exec();
        const performer = task.performers.filter(
          (data) => data.organization === userData.organizationID[0].toString(),
        );

        task.performers = performer;
        task.organizationID = [];
        task.organizationID.push(userData.organizationID[0]);

        return task;
      }
    } catch (error) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }

  async createTask(data: CreateTaskDto, user: string) {
    const task = { starterID: user, ...data, performers: [] };

    data.organizationID.forEach((organization: any) => {
      task.performers.push({ organization, steps: [...data.steps] });
    });

    try {
      return new this.taskModel({ starterID: user, ...task }).save();
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
      // const originTask = await this.getTask(id);
      // const query = {};

      // for (const org of originTask.performers) {
      //   console.log(org.organization);

      //   if (org.organization === data.organization) {
      //     console.log(org);

      //     for (const key in org['steps'][data.stepNumber - 1]) {
      //       console.log(key);

      //       // if (
      //       //   originTask.steps[data.stepNumber - 1][key] &&
      //       //   originTask.steps[data.stepNumber - 1][key] !== data[key]
      //       // ) {
      //       query[key] =
      //         originTask.performers['steps'][data.stepNumber - 1][key] ||
      //         data[key];
      //       // }
      //     }
      //   }
      // }
      // console.log(query);

      const user = await this.userModel.findById(finishedUserID).exec();

      const filter = {
        _id: id,
        'performers.organization': user.organizationID[0].toString(),
      };

      const update = {
        $set: {
          [`performers.$.steps.${data.stepNumber - 1}`]: {
            ...data,
            finishedUserID,
          },
        },
      };

      const updatedTask = await this.taskModel.findOneAndUpdate(
        filter,
        update,
        { upsert: true, useFindAndModify: false, new: true },
      );

      return updatedTask;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteTask(id: string): Promise<any> {
    try {
      return await this.taskModel.deleteOne({ _id: id });
    } catch (error) {}
  }
}
