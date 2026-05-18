import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type UploadedFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};


function toBytes(buffer?: Buffer): Uint8Array<ArrayBuffer> | null {
  if (!buffer) return null;

  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;

  return new Uint8Array(arrayBuffer);
}

@Injectable()
export class NoticiasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    titulo: string;
    descripcion: string;
    categoria: string;
    logo?: UploadedFile;
    imagenes?: UploadedFile[];
  }) {
    return this.prisma.noticia.create({
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        categoria: data.categoria,

        logoName: data.logo?.originalname ?? null,
        logoMimeType: data.logo?.mimetype ?? null,
        logoSize: data.logo?.size ?? null,
        logoData: toBytes(data.logo?.buffer),

        imagenes: {
          create: (data.imagenes ?? []).map((img) => ({
            fileName: img.originalname,
            fileMimeType: img.mimetype,
            fileSize: img.size,
            fileData: toBytes(img.buffer)!,
          })),
        },
      },
      include: {
        imagenes: {
          select: {
            id: true,
            fileName: true,
            fileMimeType: true,
            fileSize: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.noticia.findMany({
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        categoria: true,
        fecha: true,
        logoName: true,
        logoMimeType: true,
        logoSize: true,
        createdAt: true,
        updatedAt: true,
        destacada: true, 
        imagenes: {
          select: {
            id: true,
            fileName: true,
            fileMimeType: true,
            fileSize: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const noticia = await this.prisma.noticia.findUnique({
      where: { id },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        categoria: true,
        fecha: true,
        logoName: true,
        logoMimeType: true,
        logoSize: true,
        createdAt: true,
        updatedAt: true,
        destacada: true, 
        imagenes: {
          select: {
            id: true,
            fileName: true,
            fileMimeType: true,
            fileSize: true,
            createdAt: true,
          },
        },
      },
    });

    if (!noticia) {
      throw new NotFoundException('Noticia no encontrada');
    }

    return noticia;
  }

  async update(
    id: string,
    data: {
      titulo: string;
      descripcion: string;
      categoria: string;
    },
  ) {
    await this.findOne(id);

    return this.prisma.noticia.update({
      where: { id },
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        categoria: data.categoria,
      },
    });
  }

  async replaceLogo(id: string, file: UploadedFile) {
    await this.findOne(id);

    if (!file) {
      throw new NotFoundException('Logo no enviado');
    }

    return this.prisma.noticia.update({
      where: { id },
      data: {
        logoName: file.originalname,
        logoMimeType: file.mimetype,
        logoSize: file.size,
        logoData: toBytes(file.buffer),
      },
    });
  }

  async replaceImagenes(id: string, files: UploadedFile[]) {
    await this.findOne(id);

    await this.prisma.noticiaImagen.deleteMany({
      where: { noticiaId: id },
    });

    if (!files || files.length === 0) {
      return { count: 0 };
    }

    return this.prisma.noticiaImagen.createMany({
      data: files.map((file) => ({
        noticiaId: id,
        fileName: file.originalname,
        fileMimeType: file.mimetype,
        fileSize: file.size,
        fileData: toBytes(file.buffer)!,
      })),
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    return this.prisma.noticia.delete({
      where: { id },
    });
  }

  async getLogo(id: string) {
    const noticia = await this.prisma.noticia.findUnique({
      where: { id },
    });

    if (!noticia?.logoData || !noticia.logoMimeType) {
      throw new NotFoundException('Logo no encontrado');
    }

    return noticia;
  }

  async getImagen(id: string) {
    const imagen = await this.prisma.noticiaImagen.findUnique({
      where: { id },
    });

    if (!imagen) {
      throw new NotFoundException('Imagen no encontrada');
    }

    return imagen;
  }

  async updateFull(
  id: string,
  data: {
    titulo: string;
    descripcion: string;
    categoria: string;
    logo?: UploadedFile;
    imagenes?: UploadedFile[];
  },
) {
  await this.findOne(id);

  // actualizar texto + logo
  await this.prisma.noticia.update({
    where: { id },
    data: {
      titulo: data.titulo,
      descripcion: data.descripcion,
      categoria: data.categoria,

      ...(data.logo && {
        logoName: data.logo.originalname,
        logoMimeType: data.logo.mimetype,
        logoSize: data.logo.size,
        logoData: toBytes(data.logo.buffer),
      }),
    },
  });

  // reemplazar imágenes
  if (data.imagenes) {
    await this.prisma.noticiaImagen.deleteMany({ where: { noticiaId: id } });

    await this.prisma.noticiaImagen.createMany({
      data: data.imagenes.map((img) => ({
        noticiaId: id,
        fileName: img.originalname,
        fileMimeType: img.mimetype,
        fileSize: img.size,
        fileData: toBytes(img.buffer)!,
      })),
    });
  }

  return this.findOne(id);
}

async toggleDestacada(id: string, destacada: boolean) {
  await this.findOne(id);
  return this.prisma.noticia.update({
    where: { id },
    data: { destacada },
  });
}

}