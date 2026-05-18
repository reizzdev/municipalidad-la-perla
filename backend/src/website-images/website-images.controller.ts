
import {
  Controller, Get, Post, Delete, Body, Query, Param, UseGuards, Request,
  BadRequestException, Patch,
} from '@nestjs/common';
import { WebsiteImagesService } from './website-images.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';



@Controller('website-images')
export class WebsiteImagesController {
  constructor(private service: WebsiteImagesService) {}

  
  @Get(':section')
  getPublic(@Param('section') section: string) {
    return this.service.findAll(section);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('FOTOS_CRUD')
  @Get('admin/:section')
  getAdmin(@Param('section') section: string) {
    return this.service.findAllAdmin(section);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('FOTOS_CRUD')
  @Post()
  create(@Body() body) {
    return this.service.create(body);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('FOTOS_CRUD')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.service.update(id, body);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('FOTOS_CRUD')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}