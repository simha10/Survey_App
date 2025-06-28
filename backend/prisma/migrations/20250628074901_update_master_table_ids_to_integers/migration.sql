/*
  Warnings:

  - The primary key for the `ConstructionNatureMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `constructionNatureId` column on the `ConstructionNatureMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ConstructionTypeMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `constructionTypeId` column on the `ConstructionTypeMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `DisposalTypeMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `disposalTypeId` column on the `DisposalTypeMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `FloorMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `floorNumberId` column on the `FloorMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `NrPropertyCategoryMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `propertyCategoryId` column on the `NrPropertyCategoryMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `NrPropertySubCategoryMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `subCategoryId` column on the `NrPropertySubCategoryMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `OccupancyStatusMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `occupancyStatusId` column on the `OccupancyStatusMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PropertyTypeMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `propertyTypeId` column on the `PropertyTypeMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `RespondentStatusMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `respondentStatusId` column on the `RespondentStatusMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ResponseTypeMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `responseTypeId` column on the `ResponseTypeMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `RoadTypeMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `roadTypeId` column on the `RoadTypeMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `statusId` on the `SurveyStatusMapping` table. All the data in the column will be lost.
  - The `revertedFromId` column on the `SurveyStatusMapping` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SurveyStatusMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `statusId` on the `SurveyStatusMaster` table. All the data in the column will be lost.
  - The primary key for the `SurveyTypeMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `surveyTypeId` column on the `SurveyTypeMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `WardStatusMapping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `statusId` on the `WardStatusMapping` table. All the data in the column will be lost.
  - The primary key for the `WardStatusMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `statusId` on the `WardStatusMaster` table. All the data in the column will be lost.
  - The primary key for the `WaterSourceMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `waterSourceId` column on the `WaterSourceMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[surveyUniqueCode,surveyStatusId]` on the table `SurveyStatusMapping` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wardId,wardStatusId]` on the table `WardStatusMapping` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `propertyTypeId` on the `LocationDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roadTypeId` on the `LocationDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `constructionTypeId` on the `LocationDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `nrPropertyCategoryId` on the `NonResidentialPropertyAssessment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `nrSubCategoryId` on the `NonResidentialPropertyAssessment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `occupancyStatusId` on the `NonResidentialPropertyAssessment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `constructionNatureId` on the `NonResidentialPropertyAssessment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `floorNumberId` on the `NonResidentialPropertyAssessment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `propertyCategoryId` on the `NrPropertySubCategoryMaster` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `waterSourceId` on the `OtherDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `disposalTypeId` on the `OtherDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `responseTypeId` on the `PropertyDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `respondentStatusId` on the `PropertyDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `occupancyStatusId` on the `ResidentialPropertyAssessment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `constructionNatureId` on the `ResidentialPropertyAssessment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `floorNumberId` on the `ResidentialPropertyAssessment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `surveyTypeId` on the `SurveyDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `surveyStatusId` to the `SurveyStatusMapping` table without a default value. This is not possible if the table is not empty.
  - The required column `mappingId` was added to the `WardStatusMapping` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `wardStatusId` on the `WardStatusMapping` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "LocationDetails" DROP CONSTRAINT "LocationDetails_constructionTypeId_fkey";

-- DropForeignKey
ALTER TABLE "LocationDetails" DROP CONSTRAINT "LocationDetails_propertyTypeId_fkey";

-- DropForeignKey
ALTER TABLE "LocationDetails" DROP CONSTRAINT "LocationDetails_roadTypeId_fkey";

-- DropForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" DROP CONSTRAINT "NonResidentialPropertyAssessment_constructionNatureId_fkey";

-- DropForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" DROP CONSTRAINT "NonResidentialPropertyAssessment_floorNumberId_fkey";

-- DropForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" DROP CONSTRAINT "NonResidentialPropertyAssessment_nrPropertyCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" DROP CONSTRAINT "NonResidentialPropertyAssessment_nrSubCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" DROP CONSTRAINT "NonResidentialPropertyAssessment_occupancyStatusId_fkey";

-- DropForeignKey
ALTER TABLE "NrPropertySubCategoryMaster" DROP CONSTRAINT "NrPropertySubCategoryMaster_propertyCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "OtherDetails" DROP CONSTRAINT "OtherDetails_disposalTypeId_fkey";

-- DropForeignKey
ALTER TABLE "OtherDetails" DROP CONSTRAINT "OtherDetails_waterSourceId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyDetails" DROP CONSTRAINT "PropertyDetails_respondentStatusId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyDetails" DROP CONSTRAINT "PropertyDetails_responseTypeId_fkey";

-- DropForeignKey
ALTER TABLE "ResidentialPropertyAssessment" DROP CONSTRAINT "ResidentialPropertyAssessment_constructionNatureId_fkey";

-- DropForeignKey
ALTER TABLE "ResidentialPropertyAssessment" DROP CONSTRAINT "ResidentialPropertyAssessment_floorNumberId_fkey";

-- DropForeignKey
ALTER TABLE "ResidentialPropertyAssessment" DROP CONSTRAINT "ResidentialPropertyAssessment_occupancyStatusId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyDetails" DROP CONSTRAINT "SurveyDetails_surveyTypeId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyStatusMapping" DROP CONSTRAINT "SurveyStatusMapping_revertedFromId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyStatusMapping" DROP CONSTRAINT "SurveyStatusMapping_statusId_fkey";

-- DropForeignKey
ALTER TABLE "WardStatusMapping" DROP CONSTRAINT "WardStatusMapping_statusId_fkey";

-- DropIndex
DROP INDEX "SurveyStatusMapping_surveyUniqueCode_statusId_key";

-- DropIndex
DROP INDEX "WardStatusMapping_wardId_statusId_key";

-- AlterTable
ALTER TABLE "ConstructionNatureMaster" DROP CONSTRAINT "ConstructionNatureMaster_pkey",
DROP COLUMN "constructionNatureId",
ADD COLUMN     "constructionNatureId" SERIAL NOT NULL,
ADD CONSTRAINT "ConstructionNatureMaster_pkey" PRIMARY KEY ("constructionNatureId");

-- AlterTable
ALTER TABLE "ConstructionTypeMaster" DROP CONSTRAINT "ConstructionTypeMaster_pkey",
DROP COLUMN "constructionTypeId",
ADD COLUMN     "constructionTypeId" SERIAL NOT NULL,
ADD CONSTRAINT "ConstructionTypeMaster_pkey" PRIMARY KEY ("constructionTypeId");

-- AlterTable
ALTER TABLE "DisposalTypeMaster" DROP CONSTRAINT "DisposalTypeMaster_pkey",
DROP COLUMN "disposalTypeId",
ADD COLUMN     "disposalTypeId" SERIAL NOT NULL,
ADD CONSTRAINT "DisposalTypeMaster_pkey" PRIMARY KEY ("disposalTypeId");

-- AlterTable
ALTER TABLE "FloorMaster" DROP CONSTRAINT "FloorMaster_pkey",
DROP COLUMN "floorNumberId",
ADD COLUMN     "floorNumberId" SERIAL NOT NULL,
ADD CONSTRAINT "FloorMaster_pkey" PRIMARY KEY ("floorNumberId");

-- AlterTable
ALTER TABLE "LocationDetails" DROP COLUMN "propertyTypeId",
ADD COLUMN     "propertyTypeId" INTEGER NOT NULL,
DROP COLUMN "roadTypeId",
ADD COLUMN     "roadTypeId" INTEGER NOT NULL,
DROP COLUMN "constructionTypeId",
ADD COLUMN     "constructionTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "NonResidentialPropertyAssessment" DROP COLUMN "nrPropertyCategoryId",
ADD COLUMN     "nrPropertyCategoryId" INTEGER NOT NULL,
DROP COLUMN "nrSubCategoryId",
ADD COLUMN     "nrSubCategoryId" INTEGER NOT NULL,
DROP COLUMN "occupancyStatusId",
ADD COLUMN     "occupancyStatusId" INTEGER NOT NULL,
DROP COLUMN "constructionNatureId",
ADD COLUMN     "constructionNatureId" INTEGER NOT NULL,
DROP COLUMN "floorNumberId",
ADD COLUMN     "floorNumberId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "NrPropertyCategoryMaster" DROP CONSTRAINT "NrPropertyCategoryMaster_pkey",
DROP COLUMN "propertyCategoryId",
ADD COLUMN     "propertyCategoryId" SERIAL NOT NULL,
ADD CONSTRAINT "NrPropertyCategoryMaster_pkey" PRIMARY KEY ("propertyCategoryId");

-- AlterTable
ALTER TABLE "NrPropertySubCategoryMaster" DROP CONSTRAINT "NrPropertySubCategoryMaster_pkey",
DROP COLUMN "subCategoryId",
ADD COLUMN     "subCategoryId" SERIAL NOT NULL,
DROP COLUMN "propertyCategoryId",
ADD COLUMN     "propertyCategoryId" INTEGER NOT NULL,
ADD CONSTRAINT "NrPropertySubCategoryMaster_pkey" PRIMARY KEY ("subCategoryId");

-- AlterTable
ALTER TABLE "OccupancyStatusMaster" DROP CONSTRAINT "OccupancyStatusMaster_pkey",
DROP COLUMN "occupancyStatusId",
ADD COLUMN     "occupancyStatusId" SERIAL NOT NULL,
ADD CONSTRAINT "OccupancyStatusMaster_pkey" PRIMARY KEY ("occupancyStatusId");

-- AlterTable
ALTER TABLE "OtherDetails" DROP COLUMN "waterSourceId",
ADD COLUMN     "waterSourceId" INTEGER NOT NULL,
DROP COLUMN "disposalTypeId",
ADD COLUMN     "disposalTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PropertyDetails" DROP COLUMN "responseTypeId",
ADD COLUMN     "responseTypeId" INTEGER NOT NULL,
DROP COLUMN "respondentStatusId",
ADD COLUMN     "respondentStatusId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PropertyTypeMaster" DROP CONSTRAINT "PropertyTypeMaster_pkey",
DROP COLUMN "propertyTypeId",
ADD COLUMN     "propertyTypeId" SERIAL NOT NULL,
ADD CONSTRAINT "PropertyTypeMaster_pkey" PRIMARY KEY ("propertyTypeId");

-- AlterTable
ALTER TABLE "ResidentialPropertyAssessment" DROP COLUMN "occupancyStatusId",
ADD COLUMN     "occupancyStatusId" INTEGER NOT NULL,
DROP COLUMN "constructionNatureId",
ADD COLUMN     "constructionNatureId" INTEGER NOT NULL,
DROP COLUMN "floorNumberId",
ADD COLUMN     "floorNumberId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RespondentStatusMaster" DROP CONSTRAINT "RespondentStatusMaster_pkey",
DROP COLUMN "respondentStatusId",
ADD COLUMN     "respondentStatusId" SERIAL NOT NULL,
ADD CONSTRAINT "RespondentStatusMaster_pkey" PRIMARY KEY ("respondentStatusId");

-- AlterTable
ALTER TABLE "ResponseTypeMaster" DROP CONSTRAINT "ResponseTypeMaster_pkey",
DROP COLUMN "responseTypeId",
ADD COLUMN     "responseTypeId" SERIAL NOT NULL,
ADD CONSTRAINT "ResponseTypeMaster_pkey" PRIMARY KEY ("responseTypeId");

-- AlterTable
ALTER TABLE "RoadTypeMaster" DROP CONSTRAINT "RoadTypeMaster_pkey",
DROP COLUMN "roadTypeId",
ADD COLUMN     "roadTypeId" SERIAL NOT NULL,
ADD CONSTRAINT "RoadTypeMaster_pkey" PRIMARY KEY ("roadTypeId");

-- AlterTable
ALTER TABLE "SurveyDetails" DROP COLUMN "surveyTypeId",
ADD COLUMN     "surveyTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SurveyStatusMapping" DROP COLUMN "statusId",
ADD COLUMN     "surveyStatusId" INTEGER NOT NULL,
DROP COLUMN "revertedFromId",
ADD COLUMN     "revertedFromId" INTEGER;

-- AlterTable
ALTER TABLE "SurveyStatusMaster" DROP CONSTRAINT "SurveyStatusMaster_pkey",
DROP COLUMN "statusId",
ADD COLUMN     "surveyStatusId" SERIAL NOT NULL,
ADD CONSTRAINT "SurveyStatusMaster_pkey" PRIMARY KEY ("surveyStatusId");

-- AlterTable
ALTER TABLE "SurveyTypeMaster" DROP CONSTRAINT "SurveyTypeMaster_pkey",
DROP COLUMN "surveyTypeId",
ADD COLUMN     "surveyTypeId" SERIAL NOT NULL,
ADD CONSTRAINT "SurveyTypeMaster_pkey" PRIMARY KEY ("surveyTypeId");

-- AlterTable
ALTER TABLE "WardStatusMapping" DROP CONSTRAINT "WardStatusMapping_pkey",
DROP COLUMN "statusId",
ADD COLUMN     "mappingId" TEXT NOT NULL,
DROP COLUMN "wardStatusId",
ADD COLUMN     "wardStatusId" INTEGER NOT NULL,
ADD CONSTRAINT "WardStatusMapping_pkey" PRIMARY KEY ("mappingId");

-- AlterTable
ALTER TABLE "WardStatusMaster" DROP CONSTRAINT "WardStatusMaster_pkey",
DROP COLUMN "statusId",
ADD COLUMN     "wardStatusId" SERIAL NOT NULL,
ADD CONSTRAINT "WardStatusMaster_pkey" PRIMARY KEY ("wardStatusId");

-- AlterTable
ALTER TABLE "WaterSourceMaster" DROP CONSTRAINT "WaterSourceMaster_pkey",
DROP COLUMN "waterSourceId",
ADD COLUMN     "waterSourceId" SERIAL NOT NULL,
ADD CONSTRAINT "WaterSourceMaster_pkey" PRIMARY KEY ("waterSourceId");

-- CreateIndex
CREATE INDEX "NonResidentialPropertyAssessment_nrPropertyCategoryId_idx" ON "NonResidentialPropertyAssessment"("nrPropertyCategoryId");

-- CreateIndex
CREATE INDEX "NonResidentialPropertyAssessment_nrSubCategoryId_idx" ON "NonResidentialPropertyAssessment"("nrSubCategoryId");

-- CreateIndex
CREATE INDEX "NrPropertySubCategoryMaster_propertyCategoryId_idx" ON "NrPropertySubCategoryMaster"("propertyCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyStatusMapping_surveyUniqueCode_surveyStatusId_key" ON "SurveyStatusMapping"("surveyUniqueCode", "surveyStatusId");

-- CreateIndex
CREATE UNIQUE INDEX "WardStatusMapping_wardId_wardStatusId_key" ON "WardStatusMapping"("wardId", "wardStatusId");

-- AddForeignKey
ALTER TABLE "NrPropertySubCategoryMaster" ADD CONSTRAINT "NrPropertySubCategoryMaster_propertyCategoryId_fkey" FOREIGN KEY ("propertyCategoryId") REFERENCES "NrPropertyCategoryMaster"("propertyCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WardStatusMapping" ADD CONSTRAINT "WardStatusMapping_wardStatusId_fkey" FOREIGN KEY ("wardStatusId") REFERENCES "WardStatusMaster"("wardStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyStatusMapping" ADD CONSTRAINT "SurveyStatusMapping_surveyStatusId_fkey" FOREIGN KEY ("surveyStatusId") REFERENCES "SurveyStatusMaster"("surveyStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyStatusMapping" ADD CONSTRAINT "SurveyStatusMapping_revertedFromId_fkey" FOREIGN KEY ("revertedFromId") REFERENCES "SurveyStatusMaster"("surveyStatusId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetails" ADD CONSTRAINT "SurveyDetails_surveyTypeId_fkey" FOREIGN KEY ("surveyTypeId") REFERENCES "SurveyTypeMaster"("surveyTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDetails" ADD CONSTRAINT "PropertyDetails_responseTypeId_fkey" FOREIGN KEY ("responseTypeId") REFERENCES "ResponseTypeMaster"("responseTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDetails" ADD CONSTRAINT "PropertyDetails_respondentStatusId_fkey" FOREIGN KEY ("respondentStatusId") REFERENCES "RespondentStatusMaster"("respondentStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "PropertyTypeMaster"("propertyTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_roadTypeId_fkey" FOREIGN KEY ("roadTypeId") REFERENCES "RoadTypeMaster"("roadTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_constructionTypeId_fkey" FOREIGN KEY ("constructionTypeId") REFERENCES "ConstructionTypeMaster"("constructionTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherDetails" ADD CONSTRAINT "OtherDetails_waterSourceId_fkey" FOREIGN KEY ("waterSourceId") REFERENCES "WaterSourceMaster"("waterSourceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherDetails" ADD CONSTRAINT "OtherDetails_disposalTypeId_fkey" FOREIGN KEY ("disposalTypeId") REFERENCES "DisposalTypeMaster"("disposalTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentialPropertyAssessment" ADD CONSTRAINT "ResidentialPropertyAssessment_floorNumberId_fkey" FOREIGN KEY ("floorNumberId") REFERENCES "FloorMaster"("floorNumberId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentialPropertyAssessment" ADD CONSTRAINT "ResidentialPropertyAssessment_occupancyStatusId_fkey" FOREIGN KEY ("occupancyStatusId") REFERENCES "OccupancyStatusMaster"("occupancyStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentialPropertyAssessment" ADD CONSTRAINT "ResidentialPropertyAssessment_constructionNatureId_fkey" FOREIGN KEY ("constructionNatureId") REFERENCES "ConstructionNatureMaster"("constructionNatureId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_floorNumberId_fkey" FOREIGN KEY ("floorNumberId") REFERENCES "FloorMaster"("floorNumberId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_nrPropertyCategoryId_fkey" FOREIGN KEY ("nrPropertyCategoryId") REFERENCES "NrPropertyCategoryMaster"("propertyCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_nrSubCategoryId_fkey" FOREIGN KEY ("nrSubCategoryId") REFERENCES "NrPropertySubCategoryMaster"("subCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_occupancyStatusId_fkey" FOREIGN KEY ("occupancyStatusId") REFERENCES "OccupancyStatusMaster"("occupancyStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_constructionNatureId_fkey" FOREIGN KEY ("constructionNatureId") REFERENCES "ConstructionNatureMaster"("constructionNatureId") ON DELETE RESTRICT ON UPDATE CASCADE;
