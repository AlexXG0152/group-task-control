import { Organization } from 'src/organization/schemas/organization.schema';

export interface IUser {
  firstname: string;
  lastname: string;

  login: string;
  password: string;

  employmentDate: Date;
  firedDate?: Date;

  role: string;
  organizationID: Organization;
}
