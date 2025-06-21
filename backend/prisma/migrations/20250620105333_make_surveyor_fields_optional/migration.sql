-- DropForeignKey
ALTER TABLE "Surveyors" DROP CONSTRAINT "Surveyors_ulbZoneMapId_fkey";

-- DropForeignKey
ALTER TABLE "Surveyors" DROP CONSTRAINT "Surveyors_wardMohallaMapId_fkey";

-- DropForeignKey
ALTER TABLE "Surveyors" DROP CONSTRAINT "Surveyors_zoneWardMapId_fkey";

-- AlterTable
ALTER TABLE "Surveyors" ALTER COLUMN "wardNumber" DROP NOT NULL,
ALTER COLUMN "wardMohallaMapId" DROP NOT NULL,
ALTER COLUMN "zoneWardMapId" DROP NOT NULL,
ALTER COLUMN "ulbZoneMapId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Surveyors" ADD CONSTRAINT "Surveyors_wardMohallaMapId_fkey" FOREIGN KEY ("wardMohallaMapId") REFERENCES "WardMohallaMapping"("wardMohallaMapId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surveyors" ADD CONSTRAINT "Surveyors_zoneWardMapId_fkey" FOREIGN KEY ("zoneWardMapId") REFERENCES "ZoneWardMapping"("zoneWardMapId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surveyors" ADD CONSTRAINT "Surveyors_ulbZoneMapId_fkey" FOREIGN KEY ("ulbZoneMapId") REFERENCES "UlbZoneMapping"("ulbZoneMapId") ON DELETE SET NULL ON UPDATE CASCADE;
