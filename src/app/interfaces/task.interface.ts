import { IOrganization } from './organization.interface';
import { IStep } from './step.interface';
import { IUser } from './user.interface';

export interface ITask {
  starterID: IUser;
  name: string;
  description: string;
  organizationID: IOrganization[];
  startDate: Date;
  planFinishDate?: Date;
  realFinishDate?: Date;
  steps?: IStep[];
}
