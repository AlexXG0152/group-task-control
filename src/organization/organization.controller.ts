import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { OrganizationService } from './organization.service';
import { Public } from 'src/auth/common/decorators';
import { CreateOrganizationDto } from './dto/createOrganization.dto';

@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Get('/')
  async getOrganizations(@Req() req: Request, @Res() res: Response) {
    try {
      return res.send(await this.organizationService.getOrganizations());
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Get(':id')
  async getOrganization(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      return res.send(await this.organizationService.getOrganization(id));
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrganization(
    @Body() data: CreateOrganizationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      return res.send(await this.organizationService.createOrganization(data));
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Put(':id')
  async updateOrganization(
    @Param('id') id: string,
    @Body() data: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      return res.send(
        await this.organizationService.updateOrganization(id, data),
      );
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrganization(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      return res.send(await this.organizationService.deleteOrganization(id));
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }
}
