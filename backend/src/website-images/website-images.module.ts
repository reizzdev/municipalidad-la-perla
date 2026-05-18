import { Module } from '@nestjs/common';
import { WebsiteImagesService } from './website-images.service';
import { WebsiteImagesController } from './website-images.controller';
import { ReservationsGateway } from 'src/gateway/reservations.gateway';

@Module({
  providers: [WebsiteImagesService,  ReservationsGateway],
  controllers: [WebsiteImagesController],
  exports: [WebsiteImagesService], // exportado para que el Gateway pueda usarlo
})
export class WebsiteImagesModule  {}
