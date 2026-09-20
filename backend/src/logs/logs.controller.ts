import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  // GET /api/logs?limit=50&offset=0 — requiere permiso de dashboard
  @Permissions('DASHBOARD_VIEW')
  @Get()
  findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.logsService.findAll(
      limit ? parseInt(limit) : 50,
      offset ? parseInt(offset) : 0,
    );
  }

  // GET /api/logs/dashboard — requiere permiso de dashboard
  @Permissions('DASHBOARD_VIEW')
  @Get('dashboard')
  getDashboard() {
    return this.logsService.getDashboard();
  }

  // GET /api/logs/my — requiere login, logs del área autenticada
  @Get('my')
  findMine(@Request() req) {
    return this.logsService.findByArea(req.user.id);
  }

  // GET /api/logs/area/:id — requiere permiso de dashboard
  @Permissions('DASHBOARD_VIEW')
  @Get('area/:id')
  findByArea(@Param('id') id: string) {
    return this.logsService.findByArea(id);
  }
}