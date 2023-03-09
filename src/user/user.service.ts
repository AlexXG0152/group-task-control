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
import { UpdateUserPasswordDto } from './dto/updateUser.dto';
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
    return this.userModel.find().exec();
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

  async createUser(data: CreateUserDto) {
    const checkUserExists = await this.userModel
      .findOne({ login: data.login })
      .exec();

    if (checkUserExists) {
      throw new BadRequestException('User already exists!');
    }

    try {
      const hashedPassword = await this.authService.hashPassword(data.password);
      data['password'] = hashedPassword;

      const user = await new this.userModel(data).save();
      user.password = '';

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async updateUser(id: string, data: UpdateUserPasswordDto): Promise<any> {
    const oldData = await this.getUser(id);

    const isPasswordMatch = await bcrypt.compare(
      data.password,
      oldData.password,
    );

    if (isPasswordMatch) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }

    const hashedNewPassword = await this.authService.hashPassword(
      data.password,
    );

    try {
      const user = await this.userModel.findOneAndUpdate(
        { _id: id },
        { password: hashedNewPassword },
        { new: true },
      );
      delete user.password;

      return user;
    } catch (error) {}
  }

  async deleteUser(id: string): Promise<any> {
    try {
      return await this.userModel.deleteOne({ _id: id });
    } catch (error) {}
  }
}