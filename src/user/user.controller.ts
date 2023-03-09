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

import { UserService } from './user.service';
import { UpdateUserPasswordDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  async getUsers(@Req() req: Request, @Res() res: Response) {
    try {
      return res.send(await this.userService.getUsers());
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Get(':id')
  async getUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      return res.send(await this.userService.getUser(id));
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOneUser(
    @Body() user: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      return res.send(await this.userService.createUser(user));
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Put(':id')
  async updateOneUser(
    @Param('id') id: string,
    @Body() data: UpdateUserPasswordDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      return res.send(await this.userService.updateUser(id, data));
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOneUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      return res.send(await this.userService.deleteUser(id));
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }
}