import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Organization } from '../../organization/schemas/organization.schema';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, trim: true })
  firstname: string;

  @Prop({ required: true, trim: true })
  lastname: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop()
  hashedRt: string;

  @Prop({ required: true })
  employmentDate: Date;

  @Prop()
  firedDate: Date;

  @Prop({ required: true })
  role: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }],
  })
  organizationID: Organization[];
}

export const UserSchema = SchemaFactory.createForClass(User);
