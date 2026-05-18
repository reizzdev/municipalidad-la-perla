import {
  Controller, Get, Post, Delete, Body, Query, Param, UseGuards, Request,
  BadRequestException,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  LockSlotsDto,
  ConfirmReservationDto,
  CancelReservationDto,
} from './dto/create-reservation.dto';

import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // GET /api/reservations?start=2026-04-14&end=2026-04-20
  // Público — cualquiera puede ver el calendario
@Permissions('CALENDARIO_CRUD')
@Get()
findByRange(
  @Query('start') start: string,
  @Query('end') end: string
) {
  if (!start || !end) {
    throw new BadRequestException('Debe enviar start y end');
  }

  return this.reservationsService.findByRange(start, end);
}

  // POST /api/reservations/lock  — requiere login
  // Bloquea las celdas seleccionadas por 5 minutos
  @Permissions('CALENDARIO_CRUD')
  @UseGuards(JwtAuthGuard)
  @Post('lock')
  lockSlots(@Body() dto: LockSlotsDto, @Request() req) {
    return this.reservationsService.lockSlots(dto, req.user.id);
  }

  // POST /api/reservations/confirm  — requiere login
  // Confirma la reserva con datos del modal
  @Permissions('CALENDARIO_CRUD')
  @UseGuards(JwtAuthGuard)
  @Post('confirm')
  confirmReservation(@Body() dto: ConfirmReservationDto, @Request() req) {
    return this.reservationsService.confirmReservation(dto, req.user.id);
  }

  // POST /api/reservations/cancel  — requiere login
  // Cancela reserva futura
  @Permissions('CALENDARIO_CRUD')
  @UseGuards(JwtAuthGuard)
  @Post('cancel')
  cancelReservation(@Body() dto: CancelReservationDto, @Request() req) {
    return this.reservationsService.cancelReservation(dto, req.user.id);
  }

  // DELETE /api/reservations/lock/:id  — requiere login
  // Libera un lock (usuario canceló el modal)
  @Permissions('CALENDARIO_CRUD')
  @UseGuards(JwtAuthGuard)
  @Delete('lock/:id')
  releaseLock(@Param('id') id: string, @Request() req) {
    return this.reservationsService.releaseLock(id, req.user.id);
  }

  // GET /api/reservations/available-equipments?start=...&end=...
// Retorna equipos que aún no han sido tomados en ese rango horario
@Permissions('CALENDARIO_CRUD')
@Get('available-equipments')
async getAvailableEquipments(
  @Query('start') start: string,
  @Query('end') end: string,
) {
  return this.reservationsService.getAvailableEquipments(start, end);
}

// GET /api/reservations/logs
// Obtiene todos los logs de reservas
@Permissions('CALENDARIO_CRUD')
@UseGuards(JwtAuthGuard)
@Get('logs')
getReservationLogs() {
  return this.reservationsService.getReservationLogs();
}

}
