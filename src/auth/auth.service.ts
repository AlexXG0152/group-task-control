import {
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => JwtService))
    private jwt: JwtService,
  ) {}

  async signUp(data: AuthDTO) {
    const { login, password } = data;

    const user = await this.prisma.user.findFirst({ where: { login: login } });

    // if (user) {
    //   throw new BadRequestException('User already exists!');
    // }

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
    const { login, password } = data;

    const user = await this.prisma.user.findFirst({ where: { login: login } });

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
    await this.prisma.user.updateMany({
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
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const isRefreshTokenMatch = await bcrypt.compare(rfToken, user.hashedRt);

    if (!isRefreshTokenMatch) {
      throw new ForbiddenException('Access Denied');
    }

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

  async generateAccessToken(args: { id: string; login: string }) {
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
    await this.prisma.user.update({
      where: { id },
      data: { hashedRt: hash },
    });
  }

  async generateTokens(user) {
    return Promise.all([
      await this.generateAccessToken({
        id: user.id,
        login: user.login,
      }),
      await this.generateRefreshToken(user.id),
    ]);
  }
}
