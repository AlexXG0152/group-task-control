import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { checkUUID } from 'src/common/checkUUID';
import { UpdateUserPasswordDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    // @InjectConnection() private connection: Connection,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUser(id: string) {
    await checkUUID(id);
    try {
      const user = await this.userModel.findById(id).exec();
      delete user.password;
      return user;
    } catch (error) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }

  async createUser(data: CreateUserDto) {
    try {
      const hashedPassword = await this.authService.hashPassword(data.password);
      data['password'] = hashedPassword;

      const user = await this.userModel.create({
        login: data.login,
        password: hashedPassword,
        firstname: data.firstname,
        lastname: data.lastname,
        employmentDate: data.employmentDate,
        firedDate: data?.firedDate,
        role: data.role,
        organizationID: data.organizationID,
      });

      delete user.password;

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async updateUser(id: string, data: UpdateUserPasswordDto): Promise<any> {
    await checkUUID(id);

    const oldData = (await this.getUser(id)).password;

    const isPasswordMatch = await bcrypt.compare(data.newPassword, oldData);

    if (isPasswordMatch) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }

    const hashedNewPassword = await this.authService.hashPassword(
      data.newPassword,
    );

    try {
      const user = await this.userModel.updateOne({
        id: { id },
        data: {
          password: hashedNewPassword,
        },
      });
      // delete user.password;
      return user;
    } catch (error) {}
  }

  async deleteUser(id: string): Promise<any> {
    await checkUUID(id);
    // await cheskIsExists(id, this.prisma.user);
    try {
      return await this.userModel.deleteOne({ id });
    } catch (error) {}
  }
}
