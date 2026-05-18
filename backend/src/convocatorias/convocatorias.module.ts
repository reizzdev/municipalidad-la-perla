import { Module } from '@nestjs/common';
import { ConvocatoriasController } from './convocatorias.controller';
import { ConvocatoriasService } from './convocatorias.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConvocatoriasController],
  providers: [ConvocatoriasService],
})
export class ConvocatoriasModule {}