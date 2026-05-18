import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationsGateway } from 'src/gateway/reservations.gateway';

@Module({
  providers: [ReservationsService,  ReservationsGateway],
  controllers: [ReservationsController],
  exports: [ReservationsService], // exportado para que el Gateway pueda usarlo
})
export class ReservationsModule {}
