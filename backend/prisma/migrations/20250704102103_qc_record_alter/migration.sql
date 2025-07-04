/*
  Warnings:

  - The primary key for the `QCRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `qcRecordId` column on the `QCRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `isSynced` on the `SurveyDetails` table. All the data in the column will be lost.
  - You are about to drop the column `lastSyncAttempt` on the `SurveyDetails` table. All the data in the column will be lost.
  - You are about to drop the column `syncErrorMessage` on the `SurveyDetails` table. All the data in the column will be lost.
  - You are about to drop the column `syncStatus` on the `SurveyDetails` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "QCErrorType" AS ENUM ('MISSING', 'DUPLICATE', 'OTHER', 'NONE');

-- DropIndex
DROP INDEX "SurveyDetails_isSynced_idx";

-- DropIndex
DROP INDEX "SurveyDetails_syncStatus_idx";

-- AlterTable
ALTER TABLE "PropertyAttachmentDetails" ALTER COLUMN "surveyUniqueCode" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "QCRecord" DROP CONSTRAINT "QCRecord_pkey",
ADD COLUMN     "RIRemark" TEXT,
ADD COLUMN     "errorType" "QCErrorType",
ADD COLUMN     "gisTeamRemark" TEXT,
ADD COLUMN     "isError" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "surveyTeamRemark" TEXT,
DROP COLUMN "qcRecordId",
ADD COLUMN     "qcRecordId" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "QCRecord_pkey" PRIMARY KEY ("qcRecordId");

-- AlterTable
ALTER TABLE "SurveyDetails" DROP COLUMN "isSynced",
DROP COLUMN "lastSyncAttempt",
DROP COLUMN "syncErrorMessage",
DROP COLUMN "syncStatus";

-- DropEnum
DROP TYPE "SyncStatusEnum";

-- CreateIndex
CREATE INDEX "NonResidentialPropertyAssessment_surveyUniqueCode_idx" ON "NonResidentialPropertyAssessment"("surveyUniqueCode");

-- CreateIndex
CREATE INDEX "NonResidentialPropertyAssessment_occupancyStatusId_idx" ON "NonResidentialPropertyAssessment"("occupancyStatusId");

-- CreateIndex
CREATE INDEX "ResidentialPropertyAssessment_surveyUniqueCode_idx" ON "ResidentialPropertyAssessment"("surveyUniqueCode");

-- CreateIndex
CREATE INDEX "ResidentialPropertyAssessment_floorNumberId_idx" ON "ResidentialPropertyAssessment"("floorNumberId");

-- CreateIndex
CREATE INDEX "SurveyDetails_ulbId_idx" ON "SurveyDetails"("ulbId");

-- CreateIndex
CREATE INDEX "SurveyDetails_zoneId_idx" ON "SurveyDetails"("zoneId");

-- CreateIndex
CREATE INDEX "SurveyDetails_wardId_idx" ON "SurveyDetails"("wardId");

-- CreateIndex
CREATE INDEX "SurveyDetails_mohallaId_idx" ON "SurveyDetails"("mohallaId");

-- CreateIndex
CREATE INDEX "SurveyStatusMapping_surveyUniqueCode_idx" ON "SurveyStatusMapping"("surveyUniqueCode");

-- CreateIndex
CREATE INDEX "SurveyStatusMapping_surveyStatusId_idx" ON "SurveyStatusMapping"("surveyStatusId");

-- CreateIndex
CREATE INDEX "SurveyStatusMapping_changedById_idx" ON "SurveyStatusMapping"("changedById");

-- CreateIndex
CREATE INDEX "SurveyorAssignment_userId_idx" ON "SurveyorAssignment"("userId");

-- CreateIndex
CREATE INDEX "SurveyorAssignment_wardId_idx" ON "SurveyorAssignment"("wardId");

-- CreateIndex
CREATE INDEX "SurveyorAssignment_isActive_idx" ON "SurveyorAssignment"("isActive");

-- CreateIndex
CREATE INDEX "UserRoleMapping_userId_idx" ON "UserRoleMapping"("userId");

-- CreateIndex
CREATE INDEX "UserRoleMapping_roleId_idx" ON "UserRoleMapping"("roleId");

-- CreateIndex
CREATE INDEX "UsersMaster_username_idx" ON "UsersMaster"("username");

-- CreateIndex
CREATE INDEX "UsersMaster_mobileNumber_idx" ON "UsersMaster"("mobileNumber");

-- CreateIndex
CREATE INDEX "WardStatusMapping_wardId_idx" ON "WardStatusMapping"("wardId");

-- CreateIndex
CREATE INDEX "WardStatusMapping_wardStatusId_idx" ON "WardStatusMapping"("wardStatusId");
