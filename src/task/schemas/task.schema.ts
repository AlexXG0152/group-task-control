import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../user/schemas/user.schema';
import { Organization } from '../../organization/schemas/organization.schema';
import { IStep } from 'src/task/interface/step.interface';

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
  startDate: Date;

  @Prop()
  planFinishDate: Date;

  @Prop()
  realFinishDate: Date;

  @Prop({ required: true })
  steps: IStep[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
