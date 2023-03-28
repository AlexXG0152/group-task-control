import { Organization } from 'src/organization/schemas/organization.schema';
import { IStep } from '../interface/step.interface';
import { ITask } from '../interface/task.interface';

export class UpdateTaskDto implements Omit<ITask, 'starterID'> {
  organizationID: Organization[];
  name: string;
  description: string;
  startDate: Date;
  planFinishDate?: Date;
  realFinishDate?: Date;
  step?: IStep[];
}

export class UpdateStepDto implements IStep {
  stepNumber: number;
  name: string;
  desc?: string;
  done?: boolean;
  doneAt?: Date;
  comment?: string;
  finishedUserID?: string;
}

// export type UpdateDTO = UpdateStepDto | UpdateTaskDto;
