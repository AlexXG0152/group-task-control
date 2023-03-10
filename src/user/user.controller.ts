import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { UserService } from './user.service';
import { UpdateUserPasswordDto, UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { hasRoles } from 'src/auth/common/decorators';
import { RolesGuard } from 'src/auth/common/guards';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @hasRoles('user')
  @UseGuards(RolesGuard)
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
      return res.send(await this.userService.updateUserPassword(id, data));
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
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
