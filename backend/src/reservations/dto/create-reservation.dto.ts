import { IsString, IsDateString, IsArray, ArrayMinSize } from 'class-validator';

// DTO para iniciar el bloqueo de celdas (antes del modal)
export class LockSlotsDto {
  @IsDateString()
  startTime!: string; // ISO string, ej: "2026-04-15T07:00:00.000Z"

  @IsDateString()
  endTime!: string; // ISO string, ej: "2026-04-15T08:00:00.000Z"
}

// DTO para confirmar la reserva (al hacer click en "Confirmar" del modal)
export class ConfirmReservationDto {
  @IsString()
  reservationId!: string;

  @IsString()
  responsibleName!: string;

  @IsString()
  roomId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  equipmentIds!: string[]; // ["eq_laptop_id", "eq_proyector_id"]
}

// DTO para cancelar una reserva futura
export class CancelReservationDto {
  @IsString()
  reservationId!: string;
}
