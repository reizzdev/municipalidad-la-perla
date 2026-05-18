import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationStatus, LogAction } from '@prisma/client';
import { LockSlotsDto, ConfirmReservationDto, CancelReservationDto } from './dto/create-reservation.dto';

// Cuántos minutos tiene un área para confirmar desde que bloquea
const LOCK_TIMEOUT_MINUTES = 5;

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  // ----------------------------------------------------------
  // GET /reservations?start=...&end=..
  // Retorna todas las reservas en un rango de fechas (para el calendario)
  // ----------------------------------------------------------
  async findByRange(start: string, end: string) {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        startTime: { gte: new Date(start) },
        endTime: { lte: new Date(end) },
        status: { in: [ReservationStatus.CONFIRMED, ReservationStatus.LOCKING] },
      },
      include: {
        area: { select: { id: true, abbreviation: true, color: true, name: true } },
        
        room: { select: { id: true, name: true } },
        reservationEquipments: {
          include: { equipment: { select: { id: true, name: true } } },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    return reservations;
  }

  // ----------------------------------------------------------
  // POST /reservations/lock
  // Bloquea las celdas seleccionadas por 5 minutos
  // ----------------------------------------------------------
async lockSlots(dto: LockSlotsDto, areaId: string) {
  const start = new Date(dto.startTime);
  const end = new Date(dto.endTime);

  if (start.getDay() === 0) {
    throw new BadRequestException('No se pueden hacer reservas los domingos');
  }

  if (start < new Date()) {
    throw new BadRequestException('No se pueden crear reservas en horarios pasados');
  }

  const returnStart = new Date(end);
  const returnEnd = new Date(end.getTime() + 30 * 60 * 1000);

  const reservation = await this.prisma.reservation.create({
    data: {
      areaId,
      startTime: start,
      endTime: end,
      returnStart,
      returnEnd,
      status: ReservationStatus.LOCKING,
      lockedBy: areaId,
      lockedAt: new Date(),
    },
  });

  return reservation;
}
  // ----------------------------------------------------------
  // POST /reservations/confirm
  // Confirma la reserva con los datos del modal
  // ----------------------------------------------------------
async confirmReservation(dto: ConfirmReservationDto, areaId: string) {
  const reservation = await this.prisma.reservation.findUnique({
    where: { id: dto.reservationId },
  });

  if (!reservation) {
    throw new NotFoundException('Reserva no encontrada');
  }

  if (reservation.lockedBy !== areaId) {
    throw new ForbiddenException('No tienes permiso para confirmar esta reserva');
  }

  // 🔥 Verificar expiración del lock
  if (reservation.lockedAt) {
    const lockAge = (Date.now() - reservation.lockedAt.getTime()) / 1000 / 60;
    if (lockAge > LOCK_TIMEOUT_MINUTES) {
      await this.prisma.reservation.delete({ where: { id: dto.reservationId } });
      throw new BadRequestException(
        'El tiempo de configuración expiró (5 minutos). Intenta nuevamente.',
      );
    }
  }

  // 🔥 Verificar que los equipos seleccionados sigan libres
  const overlappingReservations = await this.prisma.reservation.findMany({
    where: {
      status: ReservationStatus.CONFIRMED,
      startTime: { lt: reservation.endTime },
      endTime: { gt: reservation.startTime },
    },
    include: {
      reservationEquipments: true,
    },
  });

const usedEquipmentIds = new Set(
  overlappingReservations.flatMap(r =>
    r.reservationEquipments.map(re => re.equipmentId),
  )
);

const conflictEquipment = dto.equipmentIds.find(eqId =>
  usedEquipmentIds.has(eqId),
);

  if (conflictEquipment) {
    throw new BadRequestException(
      'Uno o más equipos ya fueron tomados en este horario',
    );
  }

  // 🔥 Confirmar
  const confirmed = await this.prisma.reservation.update({
    where: { id: dto.reservationId },
    data: {
      responsibleName: dto.responsibleName,
      roomId: dto.roomId,
      status: ReservationStatus.CONFIRMED,
      lockedBy: null,
      lockedAt: null,
      reservationEquipments: {
        create: dto.equipmentIds.map(eqId => ({
          equipmentId: eqId,
        })),
      },
    },
    include: {
      area: true,
      
      room: true,
      reservationEquipments: { include: { equipment: true } },
    },
  });

  await this.createLog(
    confirmed.id,
    areaId,
    LogAction.RESERVATION,
    confirmed,
  );

  return confirmed;
}

  // ----------------------------------------------------------
  // POST /reservations/cancel
  // Cancela una reserva si su hora aún no llegó
  // ----------------------------------------------------------
  async cancelReservation(dto: CancelReservationDto, areaId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: dto.reservationId },
      include: { area: true, responsible: true },
    });

    if (!reservation) throw new NotFoundException('Reserva no encontrada');

    // Solo el área dueña puede cancelar
    if (reservation.areaId !== areaId) {
      throw new ForbiddenException('Solo el área dueña puede cancelar esta reserva');
    }

    // Regla: no se puede cancelar si el horario ya comenzó
    if (reservation.startTime <= new Date()) {
      throw new BadRequestException('No se puede cancelar una reserva que ya comenzó o está en curso');
    }

    // Cancelar
    await this.prisma.reservation.update({
      where: { id: dto.reservationId },
      data: { status: ReservationStatus.CANCELLED },
    });

    // Log de cancelación
    await this.createLog(reservation.id, areaId, LogAction.CANCELLATION, reservation);

    return { message: 'Reserva cancelada exitosamente' };
  }

  // ----------------------------------------------------------
  // DELETE /reservations/lock/:id
  // Cancela un lock (usuario hizo click en "Cancelar" del modal)
  // ----------------------------------------------------------
  async releaseLock(reservationId: string, areaId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) throw new NotFoundException('Reserva no encontrada');
    if (reservation.lockedBy !== areaId) {
      throw new ForbiddenException('No puedes liberar un lock que no es tuyo');
    }

    await this.prisma.reservation.delete({ where: { id: reservationId } });
    return { message: 'Lock liberado' };
  }

  // ----------------------------------------------------------
  // Limpieza de locks expirados (llamado por un cron o WebSocket)
  // ----------------------------------------------------------
  async cleanExpiredLocks() {
    const expiredTime = new Date(Date.now() - LOCK_TIMEOUT_MINUTES * 60 * 1000);
    const deleted = await this.prisma.reservation.deleteMany({
      where: {
        status: ReservationStatus.LOCKING,
        lockedAt: { lt: expiredTime },
      },
    });
    return deleted.count;
  }

  // ----------------------------------------------------------
  // Helper privado: crear log legible en español
  // ----------------------------------------------------------
 private async createLog(
  reservationId: string,
  areaId: string,
  action: LogAction,
  reservation: any,
) {
  const areaName = reservation.area?.name || 'Área desconocida';
  const areaAbbr = reservation.area?.abbreviation || '';
  
  const start = new Date(reservation.startTime);
  const end = new Date(reservation.endTime);
  const returnEnd = new Date(reservation.returnEnd);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatDate = (d: Date) =>
    d.toLocaleDateString('es-PE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  let description = '';

  if (action === LogAction.RESERVATION) {
    description = `${areaName} (${areaAbbr}) realizó una reserva el ${formatDate(start)} desde las ${formatTime(start)} hasta las ${formatTime(end)}`;

    // También crear log de devolución programada
    await this.prisma.reservationLog.create({
      data: {
        reservationId,
        areaId,
        action: LogAction.RETURN,
        description: `${areaName} (${areaAbbr}) debe devolver los equipos el ${formatDate(returnEnd)} antes de las ${formatTime(returnEnd)}`,
      },
    });

  } else if (action === LogAction.CANCELLATION) {
    description = `${areaName} (${areaAbbr}) realizó una cancelación de reserva el ${formatDate(start)} desde las ${formatTime(start)} hasta las ${formatTime(end)}`;
  }

  await this.prisma.reservationLog.create({
    data: { reservationId, areaId, action, description },
  });
}

  async getAvailableEquipments(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Equipos ya tomados en ese rango (en reservas CONFIRMADAS)
  const takenEquipments = await this.prisma.reservationEquipment.findMany({
    where: {
      reservation: {
        status: ReservationStatus.CONFIRMED,
        startTime: { lt: endDate },
        endTime: { gt: startDate },
      },
    },
    select: { equipmentId: true },
  });

  const takenIds = takenEquipments.map((te) => te.equipmentId);

  // Todos los equipos disponibles minus los tomados
  return this.prisma.equipment.findMany({
    where: {
      isAvailable: true,
      id: { notIn: takenIds },
    },
    select: { id: true, name: true, description: true },
    orderBy: { name: 'asc' },
  });
}

async getReservationLogs() {
  return this.prisma.reservationLog.findMany({
    orderBy: {
      createdAt: 'desc',
    },

    include: {
      area: true,
      reservation: true,
    },
  });
}

}
