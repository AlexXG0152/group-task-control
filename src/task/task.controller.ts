import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('/')
  async getTasks(@Req() req: Request, @Res() res: Response) {
    try {
      return res.send(await this.taskService.getTasks());
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Get(':id')
  async getTask(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      return res.send(await this.taskService.getTask(id));
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOneTask(
    @Body() task: CreateTaskDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      return res.send(await this.taskService.createTask(task));
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Put(':id')
  async updateOneUser(
    @Param('id') id: string,
    @Body() task: UpdateTaskDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      return res.send(await this.taskService.updateTask(id, task));
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOneTask(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      return res.send(await this.taskService.deleteTask(id));
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }
}
