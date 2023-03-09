import { Organization } from 'src/organization/schemas/organization.schema';
import { IStep } from './step.interface';
import { User } from 'src/user/schemas/user.schema';

export interface ITask {
  starterID: User;
  organizationID: Organization[];
  startDate: Date;
  planFinishDate?: Date;
  realFinishDate?: Date;
  steps?: IStep[];
}
