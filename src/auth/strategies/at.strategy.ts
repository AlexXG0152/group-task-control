import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Passport } from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: String(process.env.JWT_SECRET_KEY),
    });
  }

  validate(payload: any) {
    return payload;
  }
}
