import { Organization } from 'src/organization/schemas/organization.schema';
import { IStep } from '../interface/step.interface';
import { ITask } from '../interface/task.interface';

export class UpdateTaskDto implements Omit<ITask, 'starterID'> {
  organizationID: Organization[];
  startDate: Date;
  planFinishDate?: Date;
  realFinishDate?: Date;
  step?: IStep[];
}
