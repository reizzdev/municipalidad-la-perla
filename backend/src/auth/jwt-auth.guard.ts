import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard reutilizable: poner @UseGuards(JwtAuthGuard) en cualquier ruta protegida
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
