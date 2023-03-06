import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { Request, Response } from 'express';
import { RtGuard } from './common/guards';
import { Public } from './common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() data: AuthDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      return res.send(await this.authService.signUp(data));
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() data: AuthDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      return res.send(await this.authService.login(data));
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user;
      return res.send(await this.authService.signOut(user['id']));
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user;
      return res.send(
        await this.authService.refresh(user['id'], user['refreshToken']),
      );
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }
}
