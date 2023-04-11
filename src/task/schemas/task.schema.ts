import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../user/schemas/user.schema';
import { Organization } from '../../organization/schemas/organization.schema';
import { IStep } from 'src/task/interface/step.interface';
import { IPerformers } from '../interface/performers.interface';

export type TaskDocument = mongoose.HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  starterID: User;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }],
    required: true,
  })
  organizationID: Organization[];

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  planFinishDate: Date;

  @Prop()
  realFinishDate: Date;

  @Prop()
  steps: IStep[];

  @Prop()
  performers: IPerformers[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
