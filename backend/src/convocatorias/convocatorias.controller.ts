import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import type { Response } from "express";
import { ConvocatoriasService } from "./convocatorias.service";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionsGuard } from "../auth/permissions.guard";
import { Permissions } from "../auth/permissions.decorator";

@Controller("convocatorias")
export class ConvocatoriasController {
  constructor(private readonly service: ConvocatoriasService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions("CONVOCATORIAS_CRUD")
  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: memoryStorage(),
      limits: {
        fileSize: 15 * 1024 * 1024,
      },
    }),
  )
  async create(
    @UploadedFiles() files: any[],
    @Body() body: Record<string, string>,
  ) {
    const documentos = files.map((file) => ({
      section: file.fieldname,
      fileName: file.originalname,
      fileMimeType: file.mimetype,
      fileSize: file.size,
      fileData: file.buffer,
    }));
   

    return this.service.create({
      title: body.title,
      description: body.description,
      documentos,
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions("CONVOCATORIAS_CRUD")
  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() body: { title: string; description: string },
  ) {
    return this.service.update(id, body);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions("CONVOCATORIAS_CRUD")
  @Post(":id/documentos")
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: memoryStorage(),
      limits: {
        fileSize: 15 * 1024 * 1024,
      },
    }),
  )
  async uploadDocumentos(
    @Param("id") id: string,
    @UploadedFiles() files: any[],
    @Body() body: Record<string, string>,
  ) {
    const results: any[] = [];

    for (const file of files) {
      const section = body[`section_${file.fieldname}`];

      if (!section) {
        continue;
      }

      const saved = await this.service.saveDocumento(id, section, file);
      results.push(saved);
    }

    return results;
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions("CONVOCATORIAS_CRUD")
  @Delete(":id/documentos/:section")
  deleteDocumento(@Param("id") id: string, @Param("section") section: string) {
    return this.service.deleteDocumento(id, decodeURIComponent(section));
  }

  @Get("documentos/:documentoId/download")
  async downloadDocumento(
    @Param("documentoId") documentoId: string,
    @Res() res: Response,
  ) {
    const documento = await this.service.getDocumento(documentoId);

    res.set({
      "Content-Type": documento.fileMimeType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(
        documento.fileName,
      )}"`,
      "Content-Length": documento.fileSize.toString(),
    });

    res.send(Buffer.from(documento.fileData));
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions("CONVOCATORIAS_CRUD")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.delete(id);
  }
}
