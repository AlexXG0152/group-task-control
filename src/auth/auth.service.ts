import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { AuthDTO } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => JwtService))
    private readonly jwt: JwtService,
  ) {}

  async signUp(data: AuthDTO) {
    const { email, password } = data;

    const user = await this.userModel.findOne({ email: email });

    if (user) {
      throw new BadRequestException('User already exists!');
    }

    try {
      const createdUser = await this.userService.createUser(
        data as CreateUserDto,
      );

      const [accessToken, refreshToken] = await this.generateTokens(
        createdUser,
      );

      if (!accessToken) {
        throw new ForbiddenException();
      }

      await this.updateRefreshToken(createdUser.id, refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);
    }
  }

  async login(data: AuthDTO) {
    const { email, password } = data;

    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      throw new ForbiddenException('Access Denied1');
    }

    const isPasswordMatch = await this.comparePasswords({
      password,
      hash: user.password,
    });

    if (!isPasswordMatch) {
      throw new ForbiddenException('Access Denied2');
    }

    const [accessToken, refreshToken] = await this.generateTokens(user);

    if (!accessToken) {
      throw new ForbiddenException();
    }

    await this.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async signOut(id: string) {
    await this.userModel.updateMany({
      where: {
        id,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async refresh(id: string, rfToken: string) {
    const user = await this.userModel.findById({ id });
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    // const isRefreshTokenMatch = await bcrypt.compare(rfToken, user.hashedRt);

    // if (!isRefreshTokenMatch) {
    //   throw new ForbiddenException('Access Denied');
    // }

    const [accessToken, refreshToken] = await this.generateTokens(user);

    if (!accessToken) {
      throw new ForbiddenException();
    }

    await this.updateRefreshToken(user.id, refreshToken);

    return { refreshToken };
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, Number(process.env.CRYPT_SALT));
  }

  async comparePasswords(args: {
    password: string;
    hash: string;
  }): Promise<boolean> {
    return await bcrypt.compare(args.password, args.hash);
  }

  async generateAccessToken(args: { id: string; email: string }) {
    const payload = args;
    return await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });
  }

  async generateRefreshToken(id: string) {
    return await this.jwt.signAsync(
      { id, refresh: true },
      {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      },
    );
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const hash = await this.hashPassword(refreshToken);
    await this.userModel.updateOne({
      id: id,
      data: { hashedRt: hash },
    });
  }

  async generateTokens(user) {
    return Promise.all([
      await this.generateAccessToken({
        id: user.id,
        email: user.email,
      }),
      await this.generateRefreshToken(user.id),
    ]);
  }
}
