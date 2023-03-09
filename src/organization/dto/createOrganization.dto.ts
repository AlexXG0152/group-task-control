import { IsNotEmpty, IsString } from 'class-validator';
import { IOrganization } from '../interface/organization.interface';

export class CreateOrganizationDto implements IOrganization {
  @IsNotEmpty()
  @IsString()
  shortName: string;

  @IsNotEmpty()
  @IsString()
  longName: string;
}
