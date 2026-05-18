import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    // Buscar el área por username
    const area = await this.prisma.area.findUnique({
      where: { username: dto.username },
      include: {
        permissions: true,
      },
    });

    if (!area || !area.isActive) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    // Verificar contraseña
    const passwordValid = await bcrypt.compare(dto.password, area.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    // Generar JWT
    const payload = {
      sub: area.id,
      username: area.username,
      role: area.role,
      permissions: area.permissions.map((p) => p.name),
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      area: {
        id: area.id,
        username: area.username,
        name: area.name,
        abbreviation: area.abbreviation,
        color: area.color,
        role: area.role,
        permissions: area.permissions.map((p) => p.name),
      },
    };
  }

  // Retorna el perfil del área autenticada (usado en /auth/me)
  async getProfile(areaId: string) {
    const area = await this.prisma.area.findUnique({
      where: { id: areaId },
      include: {
        permissions: true,
        responsibles: {
          where: { isActive: true },
          orderBy: { name: "asc" },
        },
      },
    });

    if (!area) throw new UnauthorizedException();

    return {
      id: area.id,
      username: area.username,
      name: area.name,
      abbreviation: area.abbreviation,
      color: area.color,
      responsibles: area.responsibles,
      role: area.role,
      permissions: area.permissions.map((p) => p.name),
    };
  }
}
