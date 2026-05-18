import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { IncidenciasService } from "./incidencias.service";
import { CreateIncidenceDto } from "./dto/create-incidence.dto";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionsGuard } from "../auth/permissions.guard";
import { Permissions } from "../auth/permissions.decorator";

@Controller("incidencias")
export class IncidenciasController {
  constructor(private readonly service: IncidenciasService) {}

  // 🔒 SOLO OTI
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions("INCIDENCIAS_CRUD")
  @Post()
  create(@Body() dto: CreateIncidenceDto) {
    return this.service.create(dto);
  }

  // 🔒 SOLO OTI
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions("INCIDENCIAS_CRUD")
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions("INCIDENCIAS_CRUD")
  @Get("logs")
  getLogs() {
    return this.service.getLogs();
  }
}
