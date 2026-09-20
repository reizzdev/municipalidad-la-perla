import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    config: ConfigService,
  ) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET es obligatorio para iniciar el backend');
    }

    super({
      // Token viene en el header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  // Este método se llama automáticamente después de validar el token
  // El objeto que retorna se adjunta a req.user
  async validate(payload: {
  sub: string;
  username: string;
  role: string;
  permissions: string[];
}) {
    const area = await this.prisma.area.findUnique({
      where: { id: payload.sub },
      include: { permissions: true },
    });

    if (!area || !area.isActive) {
      throw new UnauthorizedException('Área no encontrada o inactiva');
    }

    return {
      id: area.id,
      username: area.username,
      abbreviation: area.abbreviation,
      color: area.color,
      name: area.name,
      role: area.role,
      permissions: area.permissions.map((permission) => permission.name),
    };
  }
}
