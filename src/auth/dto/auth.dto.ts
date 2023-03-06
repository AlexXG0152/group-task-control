import { IsNotEmpty, IsString } from 'class-validator';

export interface IAuthUserDto {
  login: string;
  password: string;
}

export class AuthDTO implements IAuthUserDto {
  @IsNotEmpty()
  @IsString()
  login: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
