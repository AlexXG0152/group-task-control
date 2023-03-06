import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export interface IUpdateUserPasswordDto {
  password: string;
}

export class UpdateUserPasswordDto implements IUpdateUserPasswordDto {
  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  password: string;
}
