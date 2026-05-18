import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Patch,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { NoticiasService } from './noticias.service';


import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';

// ✅ CORREGIDO (SIN /api)


@Controller('noticias')
export class NoticiasController {
  constructor(private readonly service: NoticiasService) {}

  // 🟢 PUBLICO
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 🟢 PUBLICO
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // 🔒 SOLO CRUD
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('NOTICIAS_CRUD')
  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: memoryStorage(),
      limits: { fileSize: 15 * 1024 * 1024 },
    }),
  )
  create(
    @UploadedFiles() files: any[],
    @Body() body: Record<string, string>,
  ) {
    const logo = files.find((file) => file.fieldname === 'logo');
    const imagenes = files.filter((file) =>
      file.fieldname.startsWith('imagen_'),
    );

    return this.service.create({
      titulo: body.titulo,
      descripcion: body.descripcion,
      categoria: body.categoria,
      logo,
      imagenes,
    });
  }

  // 🔒
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('NOTICIAS_CRUD')
@Put(':id')
@UseInterceptors(
  AnyFilesInterceptor({
    storage: memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 },
  }),
)
update(
  @Param('id') id: string,
  @UploadedFiles() files: any[],
  @Body() body: any,
) {
  const logo = files.find(f => f.fieldname === 'logo');
  const imagenes = files.filter(f => f.fieldname === 'imagenes');

  return this.service.updateFull(id, {
    titulo: body.titulo,
    descripcion: body.descripcion,
    categoria: body.categoria,
    logo,
    imagenes,
  });
}

  // 🔒
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('NOTICIAS_CRUD')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  // 🟢 PUBLICO (si quieres que el frontend muestre imagen sin login)
  @Get(':id/logo')
  async getLogo(@Param('id') id: string, @Res() res: Response) {
    const noticia = await this.service.getLogo(id);

    res.set({
      'Content-Type': noticia.logoMimeType!,
      'Content-Length': noticia.logoSize?.toString() || '0',
    });

    res.send(Buffer.from(noticia.logoData!));
  }

  // 🟢 PUBLICO
  @Get('imagenes/:id')
  async getImagen(@Param('id') id: string, @Res() res: Response) {
    const imagen = await this.service.getImagen(id);

    res.set({
      'Content-Type': imagen.fileMimeType,
      'Content-Length': imagen.fileSize.toString(),
    });

    res.send(Buffer.from(imagen.fileData));
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('NOTICIAS_CRUD')
@Patch(':id/destacada')
toggleDestacada(
  @Param('id') id: string,
  @Body('destacada') destacada: boolean,
) {
  return this.service.toggleDestacada(id, destacada);
}
}