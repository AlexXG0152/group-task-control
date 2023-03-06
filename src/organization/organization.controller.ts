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

import { UpdateUserPasswordDto } from 'src/user/dto/updateUser.dto';
import { OrganizationService } from './organization.service';
import { Public } from 'src/auth/common/decorators';

@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Public()
  @Get('/')
  async getOrganizations(@Req() req: Request, @Res() res: Response) {
    try {
      return res.send(await this.organizationService.getOrganizations());
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Public()
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

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrganization(
    @Body() data: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      return res.send(await this.organizationService.createOrganization(data));
    } catch (error) {
      return res.status(error.status).send(error);
    }
  }

  @Public()
  @Put(':id')
  async updateOrganization(
    @Param('id') id: string,
    @Body() data: UpdateUserPasswordDto,
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

  @Public()
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
