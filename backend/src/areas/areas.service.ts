import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  // Lista pública de áreas (para la leyenda del calendario)
  async findAll() {
    return this.prisma.area.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        abbreviation: true,
        color: true,
      },
      orderBy: { abbreviation: 'asc' },
    });
  }

  // Responsables de un área (para el dropdown del modal)
  async findResponsibles(areaId: string) {
    return this.prisma.responsible.findMany({
      where: { areaId, isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }

  // Equipos disponibles (para el modal)
  async findEquipments() {
    return this.prisma.equipment.findMany({
      where: { isAvailable: true },
      select: { id: true, name: true, description: true },
      orderBy: { name: 'asc' },
    });
  }

  // Salas disponibles (para el modal)
  async findRooms() {
    return this.prisma.room.findMany({
      where: { isActive: true },
      select: { id: true, name: true, floor: true },
      orderBy: { name: 'asc' },
    });
  }
}
