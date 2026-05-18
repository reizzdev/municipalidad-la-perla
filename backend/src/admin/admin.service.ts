import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// ─── DTOs inline (simples, sin archivo separado por ahora) ───────────────────

interface CreateAreaDto {
  username: string;
  password: string;
  name: string;
  abbreviation: string;
  color: string;
}

interface UpdateAreaDto {
  name?: string;
  abbreviation?: string;
  color?: string;
  isActive?: boolean;
  password?: string;
}

interface CreateResponsibleDto {
  name: string;
  areaId: string;
}

interface CreateEquipmentDto {
  name: string;
  description?: string;
}

interface CreateRoomDto {
  name: string;
  floor?: string;
}

// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ══════════════════════════════════════════════════════
  // ÁREAS (usuarios)
  // ══════════════════════════════════════════════════════

  async getAllAreas() {
    return this.prisma.area.findMany({
      orderBy: { abbreviation: 'asc' },
      include: {
        _count: { select: { responsibles: true, reservations: true } },
      },
    });
  }

  async createArea(dto: CreateAreaDto) {
    const exists = await this.prisma.area.findUnique({ where: { username: dto.username } });
    if (exists) throw new ConflictException('El username ya existe');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.prisma.area.create({
      data: {
        username: dto.username,
        passwordHash,
        name: dto.name,
        abbreviation: dto.abbreviation,
        color: dto.color,
      },
    });
  }

  async updateArea(id: string, dto: UpdateAreaDto) {
    const area = await this.prisma.area.findUnique({ where: { id } });
    if (!area) throw new NotFoundException('Área no encontrada');

    const data: any = { ...dto };
    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 10);
      delete data.password;
    }

    return this.prisma.area.update({ where: { id }, data });
  }

  async deleteArea(id: string) {
    const area = await this.prisma.area.findUnique({ where: { id } });
    if (!area) throw new NotFoundException('Área no encontrada');
    // Soft delete — solo desactivar
    return this.prisma.area.update({ where: { id }, data: { isActive: false } });
  }

  // ══════════════════════════════════════════════════════
  // RESPONSABLES
  // ══════════════════════════════════════════════════════

  async getAllResponsibles() {
    return this.prisma.responsible.findMany({
      orderBy: { name: 'asc' },
      include: { area: { select: { abbreviation: true, color: true } } },
    });
  }

  async createResponsible(dto: CreateResponsibleDto) {
    return this.prisma.responsible.create({ data: dto });
  }

  async updateResponsible(id: string, dto: Partial<CreateResponsibleDto> & { isActive?: boolean }) {
    return this.prisma.responsible.update({ where: { id }, data: dto });
  }

  async deleteResponsible(id: string) {
    return this.prisma.responsible.update({ where: { id }, data: { isActive: false } });
  }

  // ══════════════════════════════════════════════════════
  // EQUIPOS
  // ══════════════════════════════════════════════════════

  async getAllEquipments() {
    return this.prisma.equipment.findMany({ orderBy: { name: 'asc' } });
  }

  async createEquipment(dto: CreateEquipmentDto) {
    const exists = await this.prisma.equipment.findUnique({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Ya existe un equipo con ese nombre');
    return this.prisma.equipment.create({ data: dto });
  }

  async updateEquipment(id: string, dto: Partial<CreateEquipmentDto> & { isAvailable?: boolean }) {
    return this.prisma.equipment.update({ where: { id }, data: dto });
  }

  async deleteEquipment(id: string) {
    return this.prisma.equipment.update({ where: { id }, data: { isAvailable: false } });
  }

  // ══════════════════════════════════════════════════════
  // SALAS
  // ══════════════════════════════════════════════════════

  async getAllRooms() {
    return this.prisma.room.findMany({ orderBy: { name: 'asc' } });
  }

  async createRoom(dto: CreateRoomDto) {
    const exists = await this.prisma.room.findUnique({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Ya existe una sala con ese nombre');
    return this.prisma.room.create({ data: dto });
  }

  async updateRoom(id: string, dto: Partial<CreateRoomDto> & { isActive?: boolean }) {
    return this.prisma.room.update({ where: { id }, data: dto });
  }

  async deleteRoom(id: string) {
    return this.prisma.room.update({ where: { id }, data: { isActive: false } });
  }

  // ══════════════════════════════════════════════════════
  // RESERVAS (admin puede ver y eliminar cualquiera)
  // ══════════════════════════════════════════════════════

  async getAllReservations() {
    return this.prisma.reservation.findMany({
      orderBy: { startTime: 'desc' },
      include: {
        area: { select: { abbreviation: true, color: true, name: true } },
        responsible: { select: { name: true } },
        room: { select: { name: true } },
        reservationEquipments: {
          include: { equipment: { select: { name: true } } },
        },
      },
    });
  }

  async deleteReservation(id: string) {
    const r = await this.prisma.reservation.findUnique({ where: { id } });
    if (!r) throw new NotFoundException('Reserva no encontrada');
    return this.prisma.reservation.delete({ where: { id } });
  }

  async getDashboardStats(start?: string, end?: string) {
  const now = new Date();

  const dateFilter =
    start && end
      ? {
          startTime: {
            gte: new Date(start),
            lte: new Date(end),
          },
        }
      : {};

  const totalEquipments = await this.prisma.equipment.count();

  const disabledEquipments = await this.prisma.equipment.count({
    where: { isAvailable: false },
  });

  const activeReservations = await this.prisma.reservation.count({
    where: {
      startTime: { lte: now },
      endTime: { gte: now },
    },
  });

  const reservationsByDate = await this.prisma.reservation.count({
    where: dateFilter,
  });

  return {
    totalEquipments,
    disabledEquipments,
    activeReservations,
    reservationsByDate,
  };
}
}