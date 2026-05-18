import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationStatus, LogAction } from '@prisma/client';

@Injectable()
export class WebsiteImagesService {
  constructor(private prisma: PrismaService) {}

  

  findAll(section: string) {
    return this.prisma.websiteImage.findMany({
      where: { section, isActive: true },
      orderBy: { order: "asc" },
    });
  }

  findAllAdmin(section: string) {
    return this.prisma.websiteImage.findMany({
      where: { section },
      orderBy: { order: "asc" },
    });
  }

  create(data: any) {
    return this.prisma.websiteImage.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.websiteImage.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.websiteImage.delete({
      where: { id },
    });
  }
}