-- CreateTable
CREATE TABLE "convocatorias" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "convocatorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "convocatoria_documentos" (
    "id" TEXT NOT NULL,
    "convocatoriaId" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileMimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileData" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "convocatoria_documentos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "convocatoria_documentos" ADD CONSTRAINT "convocatoria_documentos_convocatoriaId_fkey" FOREIGN KEY ("convocatoriaId") REFERENCES "convocatorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;
