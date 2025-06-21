-- CreateEnum
CREATE TYPE "YesNo" AS ENUM ('YES', 'NO');

-- CreateEnum
CREATE TYPE "AssignmentType" AS ENUM ('PRIMARY', 'SECONDARY');

-- CreateEnum
CREATE TYPE "ResponseType" AS ENUM ('OLD_PROPERTY', 'NEW_PROPERTY', 'DOOR_LOCK', 'ACCESS_DENIED');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('HOUSE', 'FLAT', 'PLOT_LAND');

-- CreateEnum
CREATE TYPE "RespondentStatus" AS ENUM ('OWNER', 'OCCUPIER', 'TENANT', 'EMPLOYEE', 'OTHER');

-- CreateEnum
CREATE TYPE "RoadType" AS ENUM ('WIDTH_LESS_THAN_3M', 'WIDTH_3_TO_11M', 'WIDTH_12_TO_24M', 'WIDTH_MORE_THAN_24M');

-- CreateEnum
CREATE TYPE "ConstructionType" AS ENUM ('CONSTRUCTED', 'NOT_CONSTRUCTED', 'UNDER_CONSTRUCTION');

-- CreateEnum
CREATE TYPE "WaterSource" AS ENUM ('OWN', 'MUNICIPAL', 'PUBLIC_TAP_WITHIN_100_YARDS', 'PUBLIC_TAP_MORE_THAN_100_YARDS');

-- CreateEnum
CREATE TYPE "DisposalType" AS ENUM ('SEWERAGE', 'SEPTIC_TANK');

-- CreateEnum
CREATE TYPE "ConstructionNature" AS ENUM ('PUCCKAA_RCC_RB_ROOF', 'OTHER_PUCCKAA', 'KUCCHHAA');

-- CreateEnum
CREATE TYPE "SurveyType" AS ENUM ('RESIDENTIAL', 'NON_RESIDENTIAL', 'MIX');

-- CreateEnum
CREATE TYPE "OccupancyStatus" AS ENUM ('SELF_OCCUPIED', 'RENTED', 'MIX');

-- CreateEnum
CREATE TYPE "RolePermission" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR');

-- CreateTable
CREATE TABLE "UlbMaster" (
    "ulbId" TEXT NOT NULL,
    "ulbName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "UlbMaster_pkey" PRIMARY KEY ("ulbId")
);

-- CreateTable
CREATE TABLE "ZoneMaster" (
    "zoneId" TEXT NOT NULL,
    "zoneNumber" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "ZoneMaster_pkey" PRIMARY KEY ("zoneId")
);

-- CreateTable
CREATE TABLE "WardMaster" (
    "wardId" TEXT NOT NULL,
    "wardNumber" VARCHAR(20) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "wardName" VARCHAR(12) NOT NULL,
    "description" TEXT,

    CONSTRAINT "WardMaster_pkey" PRIMARY KEY ("wardId")
);

-- CreateTable
CREATE TABLE "MohallaMaster" (
    "mohallaId" TEXT NOT NULL,
    "mohallaName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "MohallaMaster_pkey" PRIMARY KEY ("mohallaId")
);

-- CreateTable
CREATE TABLE "ResponseTypeMaster" (
    "responseTypeId" TEXT NOT NULL,
    "responseTypeName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "ResponseTypeMaster_pkey" PRIMARY KEY ("responseTypeId")
);

-- CreateTable
CREATE TABLE "PropertyTypeMaster" (
    "propertyTypeId" TEXT NOT NULL,
    "propertyTypeName" CHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "PropertyTypeMaster_pkey" PRIMARY KEY ("propertyTypeId")
);

-- CreateTable
CREATE TABLE "RespondentStatusMaster" (
    "respondentStatusId" TEXT NOT NULL,
    "respondentStatusName" VARCHAR(20) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "RespondentStatusMaster_pkey" PRIMARY KEY ("respondentStatusId")
);

-- CreateTable
CREATE TABLE "RoadTypeMaster" (
    "roadTypeId" TEXT NOT NULL,
    "roadTypeName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "RoadTypeMaster_pkey" PRIMARY KEY ("roadTypeId")
);

-- CreateTable
CREATE TABLE "ConstructionTypeMaster" (
    "constructionTypeId" TEXT NOT NULL,
    "constructionTypeName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "ConstructionTypeMaster_pkey" PRIMARY KEY ("constructionTypeId")
);

-- CreateTable
CREATE TABLE "WaterSourceMaster" (
    "waterSourceId" TEXT NOT NULL,
    "waterSourceName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "WaterSourceMaster_pkey" PRIMARY KEY ("waterSourceId")
);

-- CreateTable
CREATE TABLE "DisposalTypeMaster" (
    "disposalTypeId" TEXT NOT NULL,
    "disposalTypeName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "DisposalTypeMaster_pkey" PRIMARY KEY ("disposalTypeId")
);

-- CreateTable
CREATE TABLE "NrPropertyCategoryMaster" (
    "propertyCategoryId" TEXT NOT NULL,
    "propertyCategoryNumber" INTEGER NOT NULL,
    "propertyCategoryName" VARCHAR(100) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NrPropertyCategoryMaster_pkey" PRIMARY KEY ("propertyCategoryId")
);

-- CreateTable
CREATE TABLE "NrPropertySubCategoryMaster" (
    "subCategoryId" TEXT NOT NULL,
    "subCategoryNumber" INTEGER NOT NULL,
    "subCategoryName" VARCHAR(100) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "propertyCategoryId" TEXT NOT NULL,

    CONSTRAINT "NrPropertySubCategoryMaster_pkey" PRIMARY KEY ("subCategoryId")
);

-- CreateTable
CREATE TABLE "ConstructionNatureMaster" (
    "constructionNatureId" TEXT NOT NULL,
    "constructionNatureName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "ConstructionNatureMaster_pkey" PRIMARY KEY ("constructionNatureId")
);

-- CreateTable
CREATE TABLE "SurveyTypeMaster" (
    "surveyTypeId" TEXT NOT NULL,
    "surveyTypeName" CHAR(20) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,

    CONSTRAINT "SurveyTypeMaster_pkey" PRIMARY KEY ("surveyTypeId")
);

-- CreateTable
CREATE TABLE "OccupancyStatusMaster" (
    "occupancyStatusId" TEXT NOT NULL,
    "occupancyStatusName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,

    CONSTRAINT "OccupancyStatusMaster_pkey" PRIMARY KEY ("occupancyStatusId")
);

-- CreateTable
CREATE TABLE "SurveyStatusMaster" (
    "statusId" TEXT NOT NULL,
    "statusName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,

    CONSTRAINT "SurveyStatusMaster_pkey" PRIMARY KEY ("statusId")
);

-- CreateTable
CREATE TABLE "WardStatusMaster" (
    "statusId" TEXT NOT NULL,
    "statusName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,

    CONSTRAINT "WardStatusMaster_pkey" PRIMARY KEY ("statusId")
);

-- CreateTable
CREATE TABLE "UsersMaster" (
    "userId" TEXT NOT NULL,
    "username" CHAR(50) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "mobileNumber" VARCHAR(20),
    "isCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "UsersMaster_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "RolePermissionMaster" (
    "roleId" TEXT NOT NULL,
    "roleName" VARCHAR(30) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "RolePermissionMaster_pkey" PRIMARY KEY ("roleId")
);

-- CreateTable
CREATE TABLE "UlbZoneMapping" (
    "ulbZoneMapId" TEXT NOT NULL,
    "ulbId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UlbZoneMapping_pkey" PRIMARY KEY ("ulbZoneMapId")
);

-- CreateTable
CREATE TABLE "ZoneWardMapping" (
    "zoneWardMapId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ZoneWardMapping_pkey" PRIMARY KEY ("zoneWardMapId")
);

-- CreateTable
CREATE TABLE "WardMohallaMapping" (
    "wardMohallaMapId" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,
    "mohallaId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WardMohallaMapping_pkey" PRIMARY KEY ("wardMohallaMapId")
);

-- CreateTable
CREATE TABLE "SurveyorAssignment" (
    "assignmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignmentType" VARCHAR(10) NOT NULL,
    "wardId" TEXT NOT NULL,
    "mohallaId" TEXT NOT NULL,
    "wardMohallaMapId" TEXT NOT NULL,
    "assignedById" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SurveyorAssignment_pkey" PRIMARY KEY ("assignmentId")
);

-- CreateTable
CREATE TABLE "WardStatusMapping" (
    "wardStatusId" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "changedById" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WardStatusMapping_pkey" PRIMARY KEY ("wardStatusId")
);

-- CreateTable
CREATE TABLE "SurveyStatusMapping" (
    "statusMappingId" TEXT NOT NULL,
    "surveyUniqueCode" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "revertedFromId" TEXT,
    "changedById" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SurveyStatusMapping_pkey" PRIMARY KEY ("statusMappingId")
);

-- CreateTable
CREATE TABLE "UserRoleMapping" (
    "userRoleMapId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserRoleMapping_pkey" PRIMARY KEY ("userRoleMapId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loginTime" TIMESTAMP(3) NOT NULL,
    "logoutTime" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "Surveyors" (
    "userId" TEXT NOT NULL,
    "surveyorName" VARCHAR(50) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "wardNumber" VARCHAR(12) NOT NULL,
    "wardMohallaMapId" TEXT NOT NULL,
    "zoneWardMapId" TEXT NOT NULL,
    "ulbZoneMapId" TEXT NOT NULL,

    CONSTRAINT "Surveyors_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Supervisors" (
    "userId" TEXT NOT NULL,
    "supervisorName" VARCHAR(50) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "wardId" TEXT NOT NULL,

    CONSTRAINT "Supervisors_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Admins" (
    "userId" TEXT NOT NULL,
    "adminName" VARCHAR(50) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(50) NOT NULL,

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "SurveyDetails" (
    "surveyUniqueCode" TEXT NOT NULL,
    "ulbId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,
    "mohallaId" TEXT NOT NULL,
    "surveyTypeId" TEXT NOT NULL,
    "entryDate" TIMESTAMP(0) NOT NULL,
    "parcelId" INTEGER,
    "mapId" INTEGER NOT NULL,
    "gisId" VARCHAR(12) NOT NULL,
    "subGisId" VARCHAR(15),

    CONSTRAINT "SurveyDetails_pkey" PRIMARY KEY ("surveyUniqueCode")
);

-- CreateTable
CREATE TABLE "PropertyDetails" (
    "surveyUniqueCode" TEXT NOT NULL,
    "responseTypeId" TEXT NOT NULL,
    "oldHouseNumber" VARCHAR(15),
    "electricityConsumerName" VARCHAR(50),
    "waterSewerageConnectionNumber" VARCHAR(50),
    "respondentName" CHAR(50) NOT NULL,
    "respondentStatusId" TEXT NOT NULL,

    CONSTRAINT "PropertyDetails_pkey" PRIMARY KEY ("surveyUniqueCode")
);

-- CreateTable
CREATE TABLE "OwnerDetails" (
    "surveyUniqueCode" TEXT NOT NULL,
    "ownerName" VARCHAR(50) NOT NULL,
    "fatherHusbandName" VARCHAR(50) NOT NULL,
    "mobileNumber" VARCHAR(20),
    "aadharNumber" CHAR(12),

    CONSTRAINT "OwnerDetails_pkey" PRIMARY KEY ("surveyUniqueCode")
);

-- CreateTable
CREATE TABLE "LocationDetails" (
    "surveyUniqueCode" TEXT NOT NULL,
    "propertyLatitude" DECIMAL(9,6) NOT NULL,
    "propertyLongitude" DECIMAL(9,6) NOT NULL,
    "assessmentYear" VARCHAR(20) NOT NULL,
    "propertyTypeId" TEXT NOT NULL,
    "buildingName" TEXT,
    "roadTypeId" TEXT NOT NULL,
    "constructionYear" VARCHAR(20) NOT NULL,
    "constructionTypeId" TEXT NOT NULL,
    "addressRoadName" TEXT NOT NULL,
    "locality" TEXT,
    "pinCode" INTEGER NOT NULL,
    "landmark" TEXT,
    "fourWayEast" TEXT,
    "fourWayWest" TEXT,
    "fourWayNorth" TEXT,
    "fourWaySouth" TEXT,
    "newWard" VARCHAR(20) NOT NULL,

    CONSTRAINT "LocationDetails_pkey" PRIMARY KEY ("surveyUniqueCode")
);

-- CreateTable
CREATE TABLE "OtherDetails" (
    "surveyUniqueCode" TEXT NOT NULL,
    "waterSourceId" TEXT NOT NULL,
    "rainWaterHarvestingSystem" CHAR(3),
    "plantation" CHAR(3),
    "parking" CHAR(3),
    "pollution" CHAR(3),
    "pollutionMeasurementTaken" TEXT,
    "waterSupplyWithin200Meters" CHAR(3),
    "sewerageLineWithin100Meters" CHAR(3),
    "disposalTypeId" TEXT NOT NULL,
    "totalPlotArea" DOUBLE PRECISION NOT NULL,
    "builtupAreaOfGroundFloor" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "OtherDetails_pkey" PRIMARY KEY ("surveyUniqueCode")
);

-- CreateTable
CREATE TABLE "ResidentialPropertyAssessment" (
    "floorAssessmentId" TEXT NOT NULL,
    "surveyUniqueCode" TEXT NOT NULL,
    "floorNumber" VARCHAR(50) NOT NULL,
    "occupancyStatusId" TEXT NOT NULL,
    "constructionNatureId" TEXT NOT NULL,
    "coveredArea" DECIMAL(10,2) NOT NULL,
    "allRoomVerandaArea" DECIMAL(10,2) NOT NULL,
    "allBalconyKitchenArea" DECIMAL(10,2) NOT NULL,
    "allGarageArea" DECIMAL(10,2) NOT NULL,
    "carpetArea" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ResidentialPropertyAssessment_pkey" PRIMARY KEY ("floorAssessmentId")
);

-- CreateTable
CREATE TABLE "NonResidentialPropertyAssessment" (
    "floorAssessmentId" TEXT NOT NULL,
    "surveyUniqueCode" TEXT NOT NULL,
    "floorNumber" VARCHAR(50) NOT NULL,
    "nrPropertyCategoryId" TEXT NOT NULL,
    "nrSubCategoryId" TEXT NOT NULL,
    "establishmentName" TEXT NOT NULL,
    "licenseNo" VARCHAR(20),
    "licenseExpiryDate" TIMESTAMP(3),
    "occupancyStatusId" TEXT NOT NULL,
    "constructionNatureId" TEXT NOT NULL,
    "builtupArea" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "NonResidentialPropertyAssessment_pkey" PRIMARY KEY ("floorAssessmentId")
);

-- CreateTable
CREATE TABLE "PropertyAttachmentDetails" (
    "surveyUniqueCode" TEXT NOT NULL,
    "image1Url" VARCHAR(50),
    "image2Url" VARCHAR(50),
    "image3Url" VARCHAR(50),
    "image4Url" VARCHAR(50),
    "image5Url" VARCHAR(50),
    "image6Url" VARCHAR(50),
    "image7Url" VARCHAR(50),
    "image8Url" VARCHAR(50),
    "image9Url" VARCHAR(50),
    "image10Url" VARCHAR(50),

    CONSTRAINT "PropertyAttachmentDetails_pkey" PRIMARY KEY ("surveyUniqueCode")
);

-- CreateIndex
CREATE INDEX "NrPropertySubCategoryMaster_propertyCategoryId_idx" ON "NrPropertySubCategoryMaster"("propertyCategoryId");

-- CreateIndex
CREATE INDEX "NrPropertySubCategoryMaster_isActive_idx" ON "NrPropertySubCategoryMaster"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "UlbZoneMapping_ulbId_zoneId_key" ON "UlbZoneMapping"("ulbId", "zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "ZoneWardMapping_zoneId_wardId_key" ON "ZoneWardMapping"("zoneId", "wardId");

-- CreateIndex
CREATE UNIQUE INDEX "WardMohallaMapping_wardId_mohallaId_key" ON "WardMohallaMapping"("wardId", "mohallaId");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyorAssignment_userId_wardId_mohallaId_key" ON "SurveyorAssignment"("userId", "wardId", "mohallaId");

-- CreateIndex
CREATE UNIQUE INDEX "WardStatusMapping_wardId_statusId_key" ON "WardStatusMapping"("wardId", "statusId");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyStatusMapping_surveyUniqueCode_statusId_key" ON "SurveyStatusMapping"("surveyUniqueCode", "statusId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoleMapping_userId_roleId_key" ON "UserRoleMapping"("userId", "roleId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "NonResidentialPropertyAssessment_nrPropertyCategoryId_idx" ON "NonResidentialPropertyAssessment"("nrPropertyCategoryId");

-- CreateIndex
CREATE INDEX "NonResidentialPropertyAssessment_nrSubCategoryId_idx" ON "NonResidentialPropertyAssessment"("nrSubCategoryId");

-- AddForeignKey
ALTER TABLE "NrPropertySubCategoryMaster" ADD CONSTRAINT "NrPropertySubCategoryMaster_propertyCategoryId_fkey" FOREIGN KEY ("propertyCategoryId") REFERENCES "NrPropertyCategoryMaster"("propertyCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UlbZoneMapping" ADD CONSTRAINT "UlbZoneMapping_ulbId_fkey" FOREIGN KEY ("ulbId") REFERENCES "UlbMaster"("ulbId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UlbZoneMapping" ADD CONSTRAINT "UlbZoneMapping_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "ZoneMaster"("zoneId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneWardMapping" ADD CONSTRAINT "ZoneWardMapping_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "ZoneMaster"("zoneId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneWardMapping" ADD CONSTRAINT "ZoneWardMapping_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "WardMaster"("wardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WardMohallaMapping" ADD CONSTRAINT "WardMohallaMapping_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "WardMaster"("wardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WardMohallaMapping" ADD CONSTRAINT "WardMohallaMapping_mohallaId_fkey" FOREIGN KEY ("mohallaId") REFERENCES "MohallaMaster"("mohallaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyorAssignment" ADD CONSTRAINT "SurveyorAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyorAssignment" ADD CONSTRAINT "SurveyorAssignment_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "WardMaster"("wardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyorAssignment" ADD CONSTRAINT "SurveyorAssignment_mohallaId_fkey" FOREIGN KEY ("mohallaId") REFERENCES "MohallaMaster"("mohallaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyorAssignment" ADD CONSTRAINT "SurveyorAssignment_wardMohallaMapId_fkey" FOREIGN KEY ("wardMohallaMapId") REFERENCES "WardMohallaMapping"("wardMohallaMapId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyorAssignment" ADD CONSTRAINT "SurveyorAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WardStatusMapping" ADD CONSTRAINT "WardStatusMapping_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "WardMaster"("wardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WardStatusMapping" ADD CONSTRAINT "WardStatusMapping_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "WardStatusMaster"("statusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WardStatusMapping" ADD CONSTRAINT "WardStatusMapping_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyStatusMapping" ADD CONSTRAINT "SurveyStatusMapping_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyStatusMapping" ADD CONSTRAINT "SurveyStatusMapping_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "SurveyStatusMaster"("statusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyStatusMapping" ADD CONSTRAINT "SurveyStatusMapping_revertedFromId_fkey" FOREIGN KEY ("revertedFromId") REFERENCES "SurveyStatusMaster"("statusId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyStatusMapping" ADD CONSTRAINT "SurveyStatusMapping_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleMapping" ADD CONSTRAINT "UserRoleMapping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleMapping" ADD CONSTRAINT "UserRoleMapping_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "RolePermissionMaster"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UsersMaster"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surveyors" ADD CONSTRAINT "Surveyors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surveyors" ADD CONSTRAINT "Surveyors_wardMohallaMapId_fkey" FOREIGN KEY ("wardMohallaMapId") REFERENCES "WardMohallaMapping"("wardMohallaMapId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surveyors" ADD CONSTRAINT "Surveyors_zoneWardMapId_fkey" FOREIGN KEY ("zoneWardMapId") REFERENCES "ZoneWardMapping"("zoneWardMapId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surveyors" ADD CONSTRAINT "Surveyors_ulbZoneMapId_fkey" FOREIGN KEY ("ulbZoneMapId") REFERENCES "UlbZoneMapping"("ulbZoneMapId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supervisors" ADD CONSTRAINT "Supervisors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supervisors" ADD CONSTRAINT "Supervisors_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "WardMaster"("wardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admins" ADD CONSTRAINT "Admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetails" ADD CONSTRAINT "SurveyDetails_ulbId_fkey" FOREIGN KEY ("ulbId") REFERENCES "UlbMaster"("ulbId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetails" ADD CONSTRAINT "SurveyDetails_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "ZoneMaster"("zoneId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetails" ADD CONSTRAINT "SurveyDetails_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "WardMaster"("wardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetails" ADD CONSTRAINT "SurveyDetails_mohallaId_fkey" FOREIGN KEY ("mohallaId") REFERENCES "MohallaMaster"("mohallaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetails" ADD CONSTRAINT "SurveyDetails_surveyTypeId_fkey" FOREIGN KEY ("surveyTypeId") REFERENCES "SurveyTypeMaster"("surveyTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDetails" ADD CONSTRAINT "PropertyDetails_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDetails" ADD CONSTRAINT "PropertyDetails_responseTypeId_fkey" FOREIGN KEY ("responseTypeId") REFERENCES "ResponseTypeMaster"("responseTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDetails" ADD CONSTRAINT "PropertyDetails_respondentStatusId_fkey" FOREIGN KEY ("respondentStatusId") REFERENCES "RespondentStatusMaster"("respondentStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerDetails" ADD CONSTRAINT "OwnerDetails_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "PropertyTypeMaster"("propertyTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_roadTypeId_fkey" FOREIGN KEY ("roadTypeId") REFERENCES "RoadTypeMaster"("roadTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_constructionTypeId_fkey" FOREIGN KEY ("constructionTypeId") REFERENCES "ConstructionTypeMaster"("constructionTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherDetails" ADD CONSTRAINT "OtherDetails_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherDetails" ADD CONSTRAINT "OtherDetails_waterSourceId_fkey" FOREIGN KEY ("waterSourceId") REFERENCES "WaterSourceMaster"("waterSourceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherDetails" ADD CONSTRAINT "OtherDetails_disposalTypeId_fkey" FOREIGN KEY ("disposalTypeId") REFERENCES "DisposalTypeMaster"("disposalTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentialPropertyAssessment" ADD CONSTRAINT "ResidentialPropertyAssessment_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentialPropertyAssessment" ADD CONSTRAINT "ResidentialPropertyAssessment_occupancyStatusId_fkey" FOREIGN KEY ("occupancyStatusId") REFERENCES "OccupancyStatusMaster"("occupancyStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentialPropertyAssessment" ADD CONSTRAINT "ResidentialPropertyAssessment_constructionNatureId_fkey" FOREIGN KEY ("constructionNatureId") REFERENCES "ConstructionNatureMaster"("constructionNatureId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_nrPropertyCategoryId_fkey" FOREIGN KEY ("nrPropertyCategoryId") REFERENCES "NrPropertyCategoryMaster"("propertyCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_nrSubCategoryId_fkey" FOREIGN KEY ("nrSubCategoryId") REFERENCES "NrPropertySubCategoryMaster"("subCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_occupancyStatusId_fkey" FOREIGN KEY ("occupancyStatusId") REFERENCES "OccupancyStatusMaster"("occupancyStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_constructionNatureId_fkey" FOREIGN KEY ("constructionNatureId") REFERENCES "ConstructionNatureMaster"("constructionNatureId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAttachmentDetails" ADD CONSTRAINT "PropertyAttachmentDetails_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;
