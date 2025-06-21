-- DropForeignKey
ALTER TABLE "Supervisors" DROP CONSTRAINT "Supervisors_wardId_fkey";

-- AlterTable
ALTER TABLE "Supervisors" ALTER COLUMN "wardId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Supervisors" ADD CONSTRAINT "Supervisors_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "WardMaster"("wardId") ON DELETE SET NULL ON UPDATE CASCADE;
