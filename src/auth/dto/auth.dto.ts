import { IsNotEmpty, IsString } from 'class-validator';

export interface IAuthUserDto {
  email: string;
  password: string;
}

export class AuthDTO implements IAuthUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
