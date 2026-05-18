import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

type DocumentoInput = {
  section: string;
  fileName: string;
  fileMimeType: string;
  fileSize: number;
  fileData: any;
};

@Injectable()
export class ConvocatoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    title: string;
    description: string;
    documentos: DocumentoInput[];
  }) {
    return this.prisma.convocatoria.create({
      data: {
        title: data.title,
        description: data.description,
        documentos: {
          create: data.documentos.map((doc) => ({
            section: doc.section,
            fileName: doc.fileName,
            fileMimeType: doc.fileMimeType,
            fileSize: doc.fileSize,
            fileData: doc.fileData as any,
          })),
        },
      },
      include: {
        documentos: true,
      },
    });
  }

  async findAll() {
    return this.prisma.convocatoria.findMany({
      include: {
        documentos: {
          select: {
            id: true,
            section: true,
            fileName: true,
            fileMimeType: true,
            fileSize: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string) {
    const convocatoria = await this.prisma.convocatoria.findUnique({
      where: { id },
      include: {
        documentos: {
          select: {
            id: true,
            section: true,
            fileName: true,
            fileMimeType: true,
            fileSize: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!convocatoria) {
      throw new NotFoundException("Convocatoria no encontrada");
    }

    return convocatoria;
  }

  async update(
    id: string,
    data: {
      title: string;
      description: string;
    },
  ) {
    const exists = await this.prisma.convocatoria.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException("Convocatoria no encontrada");
    }

    return this.prisma.convocatoria.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
      },
      include: {
        documentos: {
          select: {
            id: true,
            section: true,
            fileName: true,
            fileMimeType: true,
            fileSize: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async saveDocumento(
    convocatoriaId: string,
    section: string,
    file: {
      originalname: string;
      mimetype: string;
      size: number;
      buffer: Buffer;
    },
  ) {
    try {
      const exists = await this.prisma.convocatoria.findUnique({
        where: { id: convocatoriaId },
        select: { id: true },
      });

      if (!exists) {
        throw new NotFoundException("Convocatoria no encontrada");
      }

      // Solo las secciones que NO son ANEXOS reemplazan el archivo anterior
      if (section !== "ANEXOS") {
        await this.prisma.convocatoriaDocumento.deleteMany({
          where: {
            convocatoriaId,
            section,
          },
        });
      }

      return await this.prisma.convocatoriaDocumento.create({
        data: {
          convocatoriaId,
          section,
          fileName: file.originalname,
          fileMimeType: file.mimetype,
          fileSize: file.size,
          fileData: file.buffer as any,
        },
      });
    } catch (error) {
      console.error("Error guardando documento:", error);
      throw new InternalServerErrorException(
        "No se pudo guardar el documento. Revisa si Prisma tiene @@unique([convocatoriaId, section]).",
      );
    }
  }

  async deleteDocumento(convocatoriaId: string, section: string) {
    return this.prisma.convocatoriaDocumento.deleteMany({
      where: {
        convocatoriaId,
        section,
      },
    });
  }

  async getDocumento(documentoId: string) {
    const documento = await this.prisma.convocatoriaDocumento.findUnique({
      where: { id: documentoId },
    });

    if (!documento) {
      throw new NotFoundException("Documento no encontrado");
    }

    return documento;
  }

  async delete(id: string) {
    return this.prisma.convocatoria.delete({
      where: { id },
    });
  }
}
