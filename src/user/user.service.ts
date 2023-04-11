import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { AuthService } from 'src/auth/auth.service';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.find().exec();
      users.map((user) => {
        user.password = '';
      });
      return users;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async getUser(id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      user.password = '';
      return user;
    } catch (error) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }

  async getUserHashedRt(id: string) {
    try {
      const { hashedRt, ...user } = await this.userModel.findById(id).exec();
      user.password = '';
      return hashedRt;
    } catch (error) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }

  async createUser(data: CreateUserDto) {
    const checkUserExists = await this.userModel
      .findOne({ email: data.email })
      .exec();

    if (checkUserExists) {
      throw new BadRequestException('User already exists!');
    }

    try {
      const hashedPassword = await this.authService.hash(data.password);
      data.password = hashedPassword;

      const user = await new this.userModel(data).save();
      user.password = '';

      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }

  async updateUserPassword(
    id: string,
    data: UpdateUserPasswordDto,
  ): Promise<any> {
    const oldData = await this.getUser(id);

    const isPasswordMatch = await bcrypt.compare(
      data.password,
      oldData.password,
    );

    if (isPasswordMatch) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }

    const hashedNewPassword = await this.authService.hash(data.password);

    try {
      const user = await this.userModel.findOneAndUpdate(
        { _id: id },
        { password: hashedNewPassword },
        { new: true },
      );
      delete user.password;

      return user;
    } catch (error) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<any> {
    try {
      return await this.userModel.findOneAndUpdate(
        { _id: id },
        { ...data },
        { new: true },
      );
    } catch (error) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }

  async deleteUser(id: string): Promise<any> {
    try {
      return await this.userModel.deleteOne({ _id: id });
    } catch (error) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }
}
