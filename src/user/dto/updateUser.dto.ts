import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Organization } from 'src/organization/schemas/organization.schema';

export interface IUpdateUserPasswordDto {
  password: string;
}

export interface IUpdateUserDto {
  firstname?: string;
  lastname?: string;
  email?: string;
  employmentDate?: Date;
  firedDate?: Date;
  role?: string;
  organizationID?: Organization;
}

export class UpdateUserPasswordDto implements IUpdateUserPasswordDto {
  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto implements IUpdateUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  firstname?: string;
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  lastname?: string;
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  email?: string;
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  employmentDate?: Date;
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  firedDate?: Date;
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  role?: string;
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  organizationID?: Organization;
}
