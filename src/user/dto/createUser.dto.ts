import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Organization } from 'src/organization/schemas/organization.schema';
import { IUser, UserRole } from '../interface/user.interface';

export class CreateUserDto implements IUser {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  employmentDate: Date;

  @IsString()
  firedDate?: Date;

  @IsNotEmpty()
  @IsString()
  role: UserRole;

  @IsNotEmpty()
  @IsString()
  organizationID: Organization;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
