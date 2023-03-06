import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export interface IUpdateUserPasswordDto {
  oldPassword: string;
  newPassword: string;
}

export class UpdateUserPasswordDto implements IUpdateUserPasswordDto {
  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
