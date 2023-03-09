import { IsNotEmpty, IsString } from 'class-validator';
import { ITask } from '../interface/task.interface';
import { Organization } from 'src/organization/schemas/organization.schema';
import { User } from 'src/user/schemas/user.schema';
import { IStep } from '../interface/step.interface';

export class CreateTaskDto implements ITask {
  @IsNotEmpty()
  starterID: User;

  @IsNotEmpty()
  organizationID: Organization[];

  @IsString()
  startDate: Date;

  @IsString()
  planFinishDate?: Date;

  @IsString()
  realFinishDate?: Date;

  step?: IStep[];
}
