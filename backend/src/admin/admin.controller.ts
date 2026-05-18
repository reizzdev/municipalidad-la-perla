import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Query } from '@nestjs/common';

// TODO: en el futuro agregar un AdminGuard que verifique rol de superadmin
// Por ahora todas las rutas admin requieren solo JWT válido

import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';


@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ── ÁREAS ──────────────────────────────────────────
  @Get('areas')
  getAllAreas() { return this.adminService.getAllAreas(); }

  @Permissions('DASHBOARD_VIEW')
  @Post('areas')
  createArea(@Body() body: any) { return this.adminService.createArea(body); }

  @Permissions('DASHBOARD_VIEW')
  @Patch('areas/:id')
  updateArea(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateArea(id, body);
  }

  @Permissions('DASHBOARD_VIEW')
  @Delete('areas/:id')
  deleteArea(@Param('id') id: string) { return this.adminService.deleteArea(id); }

  // ── RESPONSABLES ───────────────────────────────────
  @Get('responsibles')
  getAllResponsibles() { return this.adminService.getAllResponsibles(); }

  @Permissions('DASHBOARD_VIEW')
  @Post('responsibles')
  createResponsible(@Body() body: any) { return this.adminService.createResponsible(body); }

  @Permissions('DASHBOARD_VIEW')
  @Patch('responsibles/:id')
  updateResponsible(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateResponsible(id, body);
  }

  @Permissions('DASHBOARD_VIEW')
  @Delete('responsibles/:id')
  deleteResponsible(@Param('id') id: string) { return this.adminService.deleteResponsible(id); }

  // ── EQUIPOS ────────────────────────────────────────
  @Get('equipments')
  getAllEquipments() { return this.adminService.getAllEquipments(); }

  @Permissions('DASHBOARD_VIEW')
  @Post('equipments')
  createEquipment(@Body() body: any) { return this.adminService.createEquipment(body); }

  @Permissions('DASHBOARD_VIEW')
  @Patch('equipments/:id')
  updateEquipment(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateEquipment(id, body); 
  }

  @Permissions('DASHBOARD_VIEW')
  @Delete('equipments/:id')
  deleteEquipment(@Param('id') id: string) { return this.adminService.deleteEquipment(id); }

  // ── SALAS ──────────────────────────────────────────
  @Get('rooms')
  getAllRooms() { return this.adminService.getAllRooms(); }

  @Permissions('DASHBOARD_VIEW')
  @Post('rooms')
  createRoom(@Body() body: any) { return this.adminService.createRoom(body); }

  @Permissions('DASHBOARD_VIEW')
  @Patch('rooms/:id')
  updateRoom(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateRoom(id, body);
  }

  @Permissions('DASHBOARD_VIEW')
  @Delete('rooms/:id')
  deleteRoom(@Param('id') id: string) { return this.adminService.deleteRoom(id); }

  // ── RESERVAS ───────────────────────────────────────
  @Get('reservations')
  getAllReservations() { return this.adminService.getAllReservations(); }

  @Permissions('DASHBOARD_VIEW')
  @Delete('reservations/:id')
  deleteReservation(@Param('id') id: string) { return this.adminService.deleteReservation(id); }
  

@Permissions('DASHBOARD_VIEW')
  @Get('stats')
getDashboardStats(
  @Query('start') start?: string,
  @Query('end') end?: string,
) {
  return this.adminService.getDashboardStats(start, end);
}
}
