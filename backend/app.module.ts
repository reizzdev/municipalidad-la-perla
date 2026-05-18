import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './src/prisma/prisma.module';
import { AuthModule } from './src/auth/auth.module';
import { ReservationsModule } from './src/reservations/reservations.module';
import { AreasModule } from './src/areas/areas.module';
import { AdminModule } from './src/admin/admin.module';
import { LogsModule } from './src/logs/logs.module';
import { CalendarGateway } from './src/gateway/calendar.gateway';
import { WebsiteImagesModule } from 'src/website-images/website-images.module';
import { ConvocatoriasModule } from 'src/convocatorias/convocatorias.module';
import { NoticiasModule } from 'src/noticias/noticias.module';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { IncidenciasModule } from 'src/incidencias/incidencias.module';

@Module({
  imports: [
    // Variables de entorno disponibles en toda la app
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ReservationsModule,
    AreasModule,
    AdminModule,
    LogsModule,
    WebsiteImagesModule,
    ConvocatoriasModule,
    NoticiasModule,
    IncidenciasModule,
  ],
  providers: [CalendarGateway, PermissionsGuard,],
})
export class AppModule {}
