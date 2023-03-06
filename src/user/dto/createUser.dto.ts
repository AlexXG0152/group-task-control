import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Organization } from 'src/organization/schemas/organization.schema';
import { IUser } from '../user.interfase';

export class CreateUserDto implements IUser {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsDate()
  employmentDate: Date;

  @IsDate()
  firedDate?: Date;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsString()
  organizationID: Organization;

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
