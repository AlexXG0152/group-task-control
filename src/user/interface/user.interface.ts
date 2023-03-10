import { Organization } from 'src/organization/schemas/organization.schema';

export interface IUser {
  firstname: string;
  lastname: string;

  email: string;
  password: string;

  employmentDate: Date;
  firedDate?: Date;

  role: UserRole;
  organizationID: Organization;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}
