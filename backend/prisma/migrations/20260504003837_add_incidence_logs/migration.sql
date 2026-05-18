-- CreateTable
CREATE TABLE "incidence_logs" (
    "id" TEXT NOT NULL,
    "incidenceId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incidence_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "incidence_logs" ADD CONSTRAINT "incidence_logs_incidenceId_fkey" FOREIGN KEY ("incidenceId") REFERENCES "incidences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
