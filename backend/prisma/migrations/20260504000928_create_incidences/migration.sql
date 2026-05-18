-- CreateEnum
CREATE TYPE "IncidenceType" AS ENUM ('TARDANZA', 'MALOGRADO');

-- CreateTable
CREATE TABLE "incidences" (
    "id" TEXT NOT NULL,
    "type" "IncidenceType" NOT NULL,
    "areaId" TEXT NOT NULL,
    "responsibleName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incidences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidence_equipments" (
    "id" TEXT NOT NULL,
    "incidenceId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,

    CONSTRAINT "incidence_equipments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "incidence_equipments_incidenceId_equipmentId_key" ON "incidence_equipments"("incidenceId", "equipmentId");

-- AddForeignKey
ALTER TABLE "incidences" ADD CONSTRAINT "incidences_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidence_equipments" ADD CONSTRAINT "incidence_equipments_incidenceId_fkey" FOREIGN KEY ("incidenceId") REFERENCES "incidences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidence_equipments" ADD CONSTRAINT "incidence_equipments_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
