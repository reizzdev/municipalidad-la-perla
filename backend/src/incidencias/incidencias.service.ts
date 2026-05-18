import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidenceDto } from './dto/create-incidence.dto';

@Injectable()
export class IncidenciasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateIncidenceDto) {
  return this.prisma.$transaction(async (prisma) => {

    const incidence = await prisma.incidence.create({
      data: {
        type: dto.type,
        areaId: dto.areaId,
        responsibleName: dto.responsibleName,
        equipments: {
          create: dto.equipments.map((equipmentId) => ({
            equipmentId,
          })),
        },
      },
      include: {
        equipments: true,
      },
    });

    await prisma.incidenceLog.create({
      data: {
        incidenceId: incidence.id,
        action: dto.type, // TARDANZA o MALOGRADO
        description: `Incidencia ${dto.type} registrada a nombre del responsable: ${dto.responsibleName}`,
      },
    });

    return incidence;
  });
}

  async findAll() {
    return this.prisma.incidence.findMany({
      include: {
        area: true,
        equipments: {
          include: {
            equipment: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }


async getLogs() {
  return this.prisma.incidenceLog.findMany({
    include: {
      incidence: {
        include: {
          area: true,
          equipments: {
            include: {
              equipment: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
}