import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(limit: number, offset: number) {
    return this.prisma.reservationLog.findMany({
      take: limit,
      skip: offset,
      include: {
        area: {
          select: { id: true, name: true, abbreviation: true, color: true },
        },
        reservation: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            returnStart: true,
            returnEnd: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByArea(areaId: string) {
    return this.prisma.reservationLog.findMany({
      where: { areaId },
      include: {
        reservation: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            returnStart: true,
            returnEnd: true,
            status: true,
            reservationEquipments: {
              include: { equipment: { select: { id: true, name: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDashboard() {
    const byArea = await this.prisma.reservationLog.groupBy({
      by: ['areaId'],
      where: { action: 'RESERVATION' },
      _count: { _all: true },
    });

    const areas = await this.prisma.area.findMany({
      select: { id: true, name: true, abbreviation: true, color: true },
    });

    const areaMap = Object.fromEntries(areas.map((a) => [a.id, a]));

    return byArea.map((row) => ({
      area: areaMap[row.areaId] ?? { id: row.areaId },
      totalReservations: row._count._all,
    }));
  }
}