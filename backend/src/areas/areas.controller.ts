import { Controller, Get, Param } from '@nestjs/common';
import { AreasService } from './areas.service';

// Todas las rutas de este controller son públicas (sin JWT)
// porque el calendario es de visualización pública
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  // GET /api/areas — leyenda del calendario
  @Get()
  findAll() {
    return this.areasService.findAll();
  }

  // GET /api/areas/:id/responsibles — dropdown del modal
  @Get(':id/responsibles')
  findResponsibles(@Param('id') id: string) {
    return this.areasService.findResponsibles(id);
  }

  // GET /api/areas/equipments — lista de equipos para el modal
  @Get('equipments/all')
  findEquipments() {
    return this.areasService.findEquipments();
  }

  // GET /api/areas/rooms/all — lista de salas para el modal
  @Get('rooms/all')
  findRooms() {
    return this.areasService.findRooms();
  }
}
