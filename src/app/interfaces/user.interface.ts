import { IOrganization } from "./organization.interface";

export interface IUser {
  firstname: string;
  lastname: string;

  email: string;
  password: string;

  employmentDate: Date;
  firedDate?: Date;

  role: UserRole;
  organizationID: IOrganization;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}
