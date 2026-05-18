-- CreateTable
CREATE TABLE "noticias" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "logoName" TEXT,
    "logoMimeType" TEXT,
    "logoSize" INTEGER,
    "logoData" BYTEA,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "noticias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "noticia_imagenes" (
    "id" TEXT NOT NULL,
    "noticiaId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileMimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileData" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "noticia_imagenes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "noticia_imagenes" ADD CONSTRAINT "noticia_imagenes_noticiaId_fkey" FOREIGN KEY ("noticiaId") REFERENCES "noticias"("id") ON DELETE CASCADE ON UPDATE CASCADE;
