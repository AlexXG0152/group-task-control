import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Organization,
  OrganizationDocument,
} from './schemas/organization.schema';
import { CreateOrganizationDto } from './dto/createOrganization.dto';
import { IOrganization } from './organization.interface';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>, // @Inject(forwardRef(() => AuthService)) // private authService: AuthService,
  ) {}

  async getOrganizations(): Promise<IOrganization[]> {
    return this.organizationModel.find().exec();
  }

  async getOrganization(id: string): Promise<IOrganization> {
    try {
      return await this.organizationModel.findById(id).exec();
    } catch (error) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }

  async createOrganization(
    data: CreateOrganizationDto,
  ): Promise<IOrganization> {
    try {
      const organization = await this.organizationModel.create({
        shortName: data.shortName,
        longName: data.longName,
      });

      return organization;
    } catch (error) {
      console.log(error);
    }
  }

  async updateOrganization(id: string, data: any): Promise<any> {
    try {
      return await this.organizationModel.findOneAndUpdate(
        { _id: id },
        { ...data },
        { new: true },
      );
    } catch (error) {
      console.log(error);
    }
  }

  async deleteOrganization(id: string): Promise<any> {
    try {
      return await this.organizationModel.deleteOne({ id });
    } catch (error) {}
  }
}
