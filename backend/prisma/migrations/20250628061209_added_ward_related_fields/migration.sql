/*
  Warnings:

  - The primary key for the `FloorMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `floornumberId` on the `FloorMaster` table. All the data in the column will be lost.
  - You are about to drop the column `newWard` on the `LocationDetails` table. All the data in the column will be lost.
  - You are about to drop the column `floornumberId` on the `NonResidentialPropertyAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `floornumberId` on the `ResidentialPropertyAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `wardNumber` on the `Surveyors` table. All the data in the column will be lost.
  - You are about to drop the column `wardNumber` on the `WardMaster` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[newWardNumber]` on the table `WardMaster` will be added. If there are existing duplicate values, this will fail.
  - The required column `floorNumberId` was added to the `FloorMaster` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `newWardNumber` to the `LocationDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MohallaMaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floorNumberId` to the `NonResidentialPropertyAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floorNumberId` to the `ResidentialPropertyAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SurveyDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Surveyors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UlbMaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UlbZoneMapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `newWardNumber` to the `WardMaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WardMaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WardMohallaMapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ZoneMaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ZoneWardMapping` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SyncStatusEnum" AS ENUM ('PENDING', 'SYNCED', 'FAILED', 'CONFLICT');

-- CreateEnum
CREATE TYPE "QCStatusEnum" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DUPLICATE', 'NEEDS_REVISION');

-- DropForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" DROP CONSTRAINT "NonResidentialPropertyAssessment_floornumberId_fkey";

-- DropForeignKey
ALTER TABLE "ResidentialPropertyAssessment" DROP CONSTRAINT "ResidentialPropertyAssessment_floornumberId_fkey";

-- AlterTable
ALTER TABLE "FloorMaster" DROP CONSTRAINT "FloorMaster_pkey",
DROP COLUMN "floornumberId",
ADD COLUMN     "floorNumberId" TEXT NOT NULL,
ADD CONSTRAINT "FloorMaster_pkey" PRIMARY KEY ("floorNumberId");

-- AlterTable
ALTER TABLE "LocationDetails" DROP COLUMN "newWard",
ADD COLUMN     "newWardNumber" VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE "MohallaMaster" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "mohallaCode" VARCHAR(20),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "mohallaName" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "NonResidentialPropertyAssessment" DROP COLUMN "floornumberId",
ADD COLUMN     "floorNumberId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ResidentialPropertyAssessment" DROP COLUMN "floornumberId",
ADD COLUMN     "floorNumberId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SurveyDetails" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isSynced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSyncAttempt" TIMESTAMP(3),
ADD COLUMN     "syncErrorMessage" TEXT,
ADD COLUMN     "syncStatus" "SyncStatusEnum" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Surveyors" DROP COLUMN "wardNumber",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UlbMaster" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ulbCode" VARCHAR(20),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "ulbName" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "UlbZoneMapping" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "WardMaster" DROP COLUMN "wardNumber",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "newWardNumber" VARCHAR(20) NOT NULL,
ADD COLUMN     "oldWardNumber" VARCHAR(20),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "wardCode" VARCHAR(20),
ALTER COLUMN "wardName" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "WardMohallaMapping" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ZoneMaster" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "zoneName" VARCHAR(100);

-- AlterTable
ALTER TABLE "ZoneWardMapping" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "QCRecord" (
    "qcRecordId" TEXT NOT NULL,
    "surveyUniqueCode" TEXT NOT NULL,
    "qcLevel" INTEGER NOT NULL,
    "qcStatus" "QCStatusEnum" NOT NULL,
    "reviewedById" TEXT NOT NULL,
    "remarks" TEXT,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QCRecord_pkey" PRIMARY KEY ("qcRecordId")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "actionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "old_value" TEXT,
    "new_value" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("actionId")
);

-- CreateIndex
CREATE INDEX "QCRecord_surveyUniqueCode_idx" ON "QCRecord"("surveyUniqueCode");

-- CreateIndex
CREATE INDEX "QCRecord_reviewedById_idx" ON "QCRecord"("reviewedById");

-- CreateIndex
CREATE INDEX "QCRecord_qcStatus_idx" ON "QCRecord"("qcStatus");

-- CreateIndex
CREATE INDEX "QCRecord_qcLevel_idx" ON "QCRecord"("qcLevel");

-- CreateIndex
CREATE UNIQUE INDEX "QCRecord_surveyUniqueCode_qcLevel_key" ON "QCRecord"("surveyUniqueCode", "qcLevel");

-- CreateIndex
CREATE INDEX "MohallaMaster_mohallaName_idx" ON "MohallaMaster"("mohallaName");

-- CreateIndex
CREATE INDEX "SurveyDetails_isSynced_idx" ON "SurveyDetails"("isSynced");

-- CreateIndex
CREATE INDEX "SurveyDetails_syncStatus_idx" ON "SurveyDetails"("syncStatus");

-- CreateIndex
CREATE INDEX "SurveyDetails_createdAt_idx" ON "SurveyDetails"("createdAt");

-- CreateIndex
CREATE INDEX "WardMaster_oldWardNumber_idx" ON "WardMaster"("oldWardNumber");

-- CreateIndex
CREATE INDEX "WardMaster_wardName_idx" ON "WardMaster"("wardName");

-- CreateIndex
CREATE UNIQUE INDEX "WardMaster_newWardNumber_key" ON "WardMaster"("newWardNumber");

-- AddForeignKey
ALTER TABLE "ResidentialPropertyAssessment" ADD CONSTRAINT "ResidentialPropertyAssessment_floorNumberId_fkey" FOREIGN KEY ("floorNumberId") REFERENCES "FloorMaster"("floorNumberId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_floorNumberId_fkey" FOREIGN KEY ("floorNumberId") REFERENCES "FloorMaster"("floorNumberId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCRecord" ADD CONSTRAINT "QCRecord_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCRecord" ADD CONSTRAINT "QCRecord_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
