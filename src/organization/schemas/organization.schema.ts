import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type OrganizationDocument = mongoose.HydratedDocument<Organization>;

@Schema()
export class Organization {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  shortName: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  longName: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
