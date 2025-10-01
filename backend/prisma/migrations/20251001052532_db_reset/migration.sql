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

-- CreateEnum
CREATE TYPE "QCStatusEnum" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DUPLICATE', 'NEEDS_REVISION', 'SURVEY_QC_PENDING', 'SURVEY_QC_DONE', 'IN_OFFICE_QC_PENDING', 'IN_OFFICE_QC_DONE', 'RI_QC_PENDING', 'RI_QC_DONE', 'FINAL_QC_PENDING', 'FINAL_QC_DONE', 'REVERTED_TO_SURVEY', 'REVERTED_TO_IN_OFFICE', 'REVERTED_TO_RI', 'REVERTED_TO_FINAL');

-- CreateEnum
CREATE TYPE "QCErrorType" AS ENUM ('MISSING', 'DUPLICATE', 'OTHER', 'NONE');

-- CreateTable
CREATE TABLE "UlbMaster" (
    "ulbId" TEXT NOT NULL,
    "ulbName" VARCHAR(100) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ulbCode" VARCHAR(20),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UlbMaster_pkey" PRIMARY KEY ("ulbId")
);

-- CreateTable
CREATE TABLE "ZoneMaster" (
    "zoneId" TEXT NOT NULL,
    "zoneNumber" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "zoneName" VARCHAR(100),

    CONSTRAINT "ZoneMaster_pkey" PRIMARY KEY ("zoneId")
);

-- CreateTable
CREATE TABLE "WardMaster" (
    "wardId" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "wardName" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "newWardNumber" VARCHAR(20) NOT NULL,
    "oldWardNumber" VARCHAR(20),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "wardCode" VARCHAR(20),

    CONSTRAINT "WardMaster_pkey" PRIMARY KEY ("wardId")
);

-- CreateTable
CREATE TABLE "MohallaMaster" (
    "mohallaId" TEXT NOT NULL,
    "mohallaName" VARCHAR(100) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mohallaCode" VARCHAR(20),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MohallaMaster_pkey" PRIMARY KEY ("mohallaId")
);

-- CreateTable
CREATE TABLE "ResponseTypeMaster" (
    "responseTypeName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "responseTypeId" SERIAL NOT NULL,

    CONSTRAINT "ResponseTypeMaster_pkey" PRIMARY KEY ("responseTypeId")
);

-- CreateTable
CREATE TABLE "PropertyTypeMaster" (
    "propertyTypeName" CHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "propertyTypeId" SERIAL NOT NULL,

    CONSTRAINT "PropertyTypeMaster_pkey" PRIMARY KEY ("propertyTypeId")
);

-- CreateTable
CREATE TABLE "RespondentStatusMaster" (
    "respondentStatusName" VARCHAR(20) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "respondentStatusId" SERIAL NOT NULL,

    CONSTRAINT "RespondentStatusMaster_pkey" PRIMARY KEY ("respondentStatusId")
);

-- CreateTable
CREATE TABLE "RoadTypeMaster" (
    "roadTypeName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "roadTypeId" SERIAL NOT NULL,

    CONSTRAINT "RoadTypeMaster_pkey" PRIMARY KEY ("roadTypeId")
);

-- CreateTable
CREATE TABLE "ConstructionTypeMaster" (
    "constructionTypeName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "constructionTypeId" SERIAL NOT NULL,

    CONSTRAINT "ConstructionTypeMaster_pkey" PRIMARY KEY ("constructionTypeId")
);

-- CreateTable
CREATE TABLE "WaterSourceMaster" (
    "waterSourceName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "waterSourceId" SERIAL NOT NULL,

    CONSTRAINT "WaterSourceMaster_pkey" PRIMARY KEY ("waterSourceId")
);

-- CreateTable
CREATE TABLE "DisposalTypeMaster" (
    "disposalTypeName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "disposalTypeId" SERIAL NOT NULL,

    CONSTRAINT "DisposalTypeMaster_pkey" PRIMARY KEY ("disposalTypeId")
);

-- CreateTable
CREATE TABLE "FloorMaster" (
    "floorNumberName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "floorNumberId" SERIAL NOT NULL,

    CONSTRAINT "FloorMaster_pkey" PRIMARY KEY ("floorNumberId")
);

-- CreateTable
CREATE TABLE "NrPropertyCategoryMaster" (
    "propertyCategoryNumber" INTEGER NOT NULL,
    "propertyCategoryName" VARCHAR(200) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "propertyCategoryId" SERIAL NOT NULL,

    CONSTRAINT "NrPropertyCategoryMaster_pkey" PRIMARY KEY ("propertyCategoryId")
);

-- CreateTable
CREATE TABLE "NrPropertySubCategoryMaster" (
    "subCategoryNumber" INTEGER NOT NULL,
    "subCategoryName" VARCHAR(100) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subCategoryId" SERIAL NOT NULL,
    "propertyCategoryId" INTEGER NOT NULL,

    CONSTRAINT "NrPropertySubCategoryMaster_pkey" PRIMARY KEY ("subCategoryId")
);

-- CreateTable
CREATE TABLE "ConstructionNatureMaster" (
    "constructionNatureName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "constructionNatureId" SERIAL NOT NULL,

    CONSTRAINT "ConstructionNatureMaster_pkey" PRIMARY KEY ("constructionNatureId")
);

-- CreateTable
CREATE TABLE "SurveyTypeMaster" (
    "surveyTypeName" CHAR(20) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "surveyTypeId" SERIAL NOT NULL,

    CONSTRAINT "SurveyTypeMaster_pkey" PRIMARY KEY ("surveyTypeId")
);

-- CreateTable
CREATE TABLE "OccupancyStatusMaster" (
    "occupancyStatusName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "occupancyStatusId" SERIAL NOT NULL,

    CONSTRAINT "OccupancyStatusMaster_pkey" PRIMARY KEY ("occupancyStatusId")
);

-- CreateTable
CREATE TABLE "SurveyStatusMaster" (
    "statusName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "surveyStatusId" SERIAL NOT NULL,

    CONSTRAINT "SurveyStatusMaster_pkey" PRIMARY KEY ("surveyStatusId")
);

-- CreateTable
CREATE TABLE "WardStatusMaster" (
    "statusName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "wardStatusId" SERIAL NOT NULL,

    CONSTRAINT "WardStatusMaster_pkey" PRIMARY KEY ("wardStatusId")
);

-- CreateTable
CREATE TABLE "UsersMaster" (
    "userId" TEXT NOT NULL,
    "username" CHAR(50) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "mobileNumber" VARCHAR(20),
    "isCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "name" VARCHAR(100),

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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UlbZoneMapping_pkey" PRIMARY KEY ("ulbZoneMapId")
);

-- CreateTable
CREATE TABLE "ZoneWardMapping" (
    "zoneWardMapId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoneWardMapping_pkey" PRIMARY KEY ("zoneWardMapId")
);

-- CreateTable
CREATE TABLE "WardMohallaMapping" (
    "wardMohallaMapId" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,
    "mohallaId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WardMohallaMapping_pkey" PRIMARY KEY ("wardMohallaMapId")
);

-- CreateTable
CREATE TABLE "SurveyorAssignment" (
    "assignmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignmentType" VARCHAR(10) NOT NULL,
    "wardId" TEXT NOT NULL,
    "assignedById" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "mohallaIds" VARCHAR(36)[],

    CONSTRAINT "SurveyorAssignment_pkey" PRIMARY KEY ("assignmentId")
);

-- CreateTable
CREATE TABLE "WardStatusMapping" (
    "wardId" TEXT NOT NULL,
    "changedById" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "mappingId" TEXT NOT NULL,
    "wardStatusId" INTEGER NOT NULL,

    CONSTRAINT "WardStatusMapping_pkey" PRIMARY KEY ("mappingId")
);

-- CreateTable
CREATE TABLE "SurveyStatusMapping" (
    "statusMappingId" TEXT NOT NULL,
    "surveyUniqueCode" UUID NOT NULL,
    "changedById" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "surveyStatusId" INTEGER NOT NULL,
    "revertedFromId" INTEGER,

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
    "password" VARCHAR(250) NOT NULL,
    "wardMohallaMapId" TEXT,
    "zoneWardMapId" TEXT,
    "ulbZoneMapId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Surveyors_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Supervisors" (
    "userId" TEXT NOT NULL,
    "supervisorName" VARCHAR(50) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(250) NOT NULL,
    "wardId" TEXT,

    CONSTRAINT "Supervisors_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Admins" (
    "userId" TEXT NOT NULL,
    "adminName" VARCHAR(50) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(250) NOT NULL,

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "SurveyDetails" (
    "surveyUniqueCode" UUID NOT NULL DEFAULT gen_random_uuid(),
    "uploadedById" TEXT NOT NULL,
    "ulbId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,
    "mohallaId" TEXT NOT NULL,
    "surveyTypeId" INTEGER NOT NULL,
    "entryDate" TIMESTAMP(0) NOT NULL,
    "parcelId" INTEGER,
    "mapId" INTEGER NOT NULL,
    "gisId" VARCHAR(12) NOT NULL,
    "subGisId" VARCHAR(15),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurveyDetails_pkey" PRIMARY KEY ("surveyUniqueCode")
);

-- CreateTable
CREATE TABLE "PropertyDetails" (
    "surveyUniqueCode" UUID NOT NULL,
    "responseTypeId" INTEGER NOT NULL,
    "oldHouseNumber" VARCHAR(15),
    "electricityConsumerName" VARCHAR(50),
    "waterSewerageConnectionNumber" VARCHAR(50),
    "respondentName" CHAR(50) NOT NULL,
    "respondentStatusId" INTEGER NOT NULL,

    CONSTRAINT "PropertyDetails_pkey" PRIMARY KEY ("surveyUniqueCode")
);

-- CreateTable
CREATE TABLE "OwnerDetails" (
    "surveyUniqueCode" UUID NOT NULL,
    "ownerName" VARCHAR(50) NOT NULL,
    "fatherHusbandName" VARCHAR(50) NOT NULL,
    "mobileNumber" VARCHAR(20),
    "aadharNumber" CHAR(12),

    CONSTRAINT "OwnerDetails_pkey" PRIMARY KEY ("surveyUniqueCode")
);

-- CreateTable
CREATE TABLE "LocationDetails" (
    "surveyUniqueCode" UUID NOT NULL,
    "propertyLatitude" DECIMAL(12,8),
    "propertyLongitude" DECIMAL(12,8),
    "assessmentYear" VARCHAR(20) NOT NULL,
    "propertyTypeId" INTEGER,
    "buildingName" TEXT,
    "roadTypeId" INTEGER NOT NULL,
    "constructionYear" VARCHAR(20) NOT NULL,
    "constructionTypeId" INTEGER NOT NULL,
    "addressRoadName" TEXT NOT NULL,
    "locality" TEXT,
    "pinCode" INTEGER NOT NULL,
    "landmark" TEXT,
    "fourWayEast" TEXT,
    "fourWayWest" TEXT,
    "fourWayNorth" TEXT,
    "fourWaySouth" TEXT,
    "newWardNumber" VARCHAR(20) NOT NULL,

    CONSTRAINT "LocationDetails_pkey" PRIMARY KEY ("surveyUniqueCode")
);

-- CreateTable
CREATE TABLE "OtherDetails" (
    "surveyUniqueCode" UUID NOT NULL,
    "waterSourceId" INTEGER NOT NULL,
    "rainWaterHarvestingSystem" CHAR(3) NOT NULL,
    "plantation" CHAR(3),
    "parking" CHAR(3),
    "pollution" CHAR(3),
    "pollutionMeasurementTaken" TEXT,
    "waterSupplyWithin200Meters" CHAR(3) NOT NULL,
    "sewerageLineWithin100Meters" CHAR(3) NOT NULL,
    "disposalTypeId" INTEGER NOT NULL,
    "totalPlotArea" DOUBLE PRECISION NOT NULL,
    "builtupAreaOfGroundFloor" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "OtherDetails_pkey" PRIMARY KEY ("surveyUniqueCode")
);

-- CreateTable
CREATE TABLE "ResidentialPropertyAssessment" (
    "floorAssessmentId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "surveyUniqueCode" UUID NOT NULL,
    "floorNumberId" INTEGER NOT NULL,
    "occupancyStatusId" INTEGER NOT NULL,
    "constructionNatureId" INTEGER NOT NULL,
    "coveredArea" DECIMAL(10,2) NOT NULL,
    "allRoomVerandaArea" DECIMAL(10,2),
    "allBalconyKitchenArea" DECIMAL(10,2),
    "allGarageArea" DECIMAL(10,2),
    "carpetArea" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ResidentialPropertyAssessment_pkey" PRIMARY KEY ("floorAssessmentId")
);

-- CreateTable
CREATE TABLE "NonResidentialPropertyAssessment" (
    "floorAssessmentId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "surveyUniqueCode" UUID NOT NULL,
    "floorNumberId" INTEGER NOT NULL,
    "nrPropertyCategoryId" INTEGER NOT NULL,
    "nrSubCategoryId" INTEGER NOT NULL,
    "establishmentName" TEXT NOT NULL,
    "licenseNo" VARCHAR(20),
    "licenseExpiryDate" TIMESTAMP(3),
    "occupancyStatusId" INTEGER NOT NULL,
    "constructionNatureId" INTEGER NOT NULL,
    "builtupArea" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "NonResidentialPropertyAssessment_pkey" PRIMARY KEY ("floorAssessmentId")
);

-- CreateTable
CREATE TABLE "PropertyAttachmentDetails" (
    "surveyUniqueCode" UUID NOT NULL,
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
    "surveyImagesId" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "PropertyAttachmentDetails_pkey" PRIMARY KEY ("surveyImagesId")
);

-- CreateTable
CREATE TABLE "QCRecord" (
    "surveyUniqueCode" UUID NOT NULL,
    "qcLevel" INTEGER NOT NULL,
    "qcStatus" "QCStatusEnum" NOT NULL,
    "reviewedById" TEXT NOT NULL,
    "remarks" TEXT,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "RIRemark" TEXT,
    "errorType" "QCErrorType",
    "gisTeamRemark" TEXT,
    "isError" BOOLEAN NOT NULL DEFAULT false,
    "surveyTeamRemark" TEXT,
    "qcRecordId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "revertedFromLevel" INTEGER,
    "revertedReason" TEXT,
    "lastViewedAt" TIMESTAMP(3),
    "bulkActionId" UUID,

    CONSTRAINT "QCRecord_pkey" PRIMARY KEY ("qcRecordId")
);

-- CreateTable
CREATE TABLE "QCSectionRecord" (
    "qcSectionRecordId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "surveyUniqueCode" UUID NOT NULL,
    "qcLevel" INTEGER NOT NULL,
    "sectionKey" VARCHAR(64) NOT NULL,
    "qcStatus" "QCStatusEnum" NOT NULL,
    "remarks" TEXT,
    "reviewedById" TEXT NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QCSectionRecord_pkey" PRIMARY KEY ("qcSectionRecordId")
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

-- CreateTable
CREATE TABLE "QCLevelMaster" (
    "qcLevelId" SERIAL NOT NULL,
    "levelName" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QCLevelMaster_pkey" PRIMARY KEY ("qcLevelId")
);

-- CreateTable
CREATE TABLE "BulkActionLog" (
    "bulkActionId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "actionType" VARCHAR(50) NOT NULL,
    "performedById" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,
    "affectedSurveyCodes" UUID[],
    "qcLevel" INTEGER NOT NULL,

    CONSTRAINT "BulkActionLog_pkey" PRIMARY KEY ("bulkActionId")
);

-- CreateTable
CREATE TABLE "QCErrorTypeMaster" (
    "errorTypeId" SERIAL NOT NULL,
    "errorCode" VARCHAR(10) NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QCErrorTypeMaster_pkey" PRIMARY KEY ("errorTypeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "WardMaster_newWardNumber_key" ON "WardMaster"("newWardNumber");

-- CreateIndex
CREATE INDEX "WardMaster_oldWardNumber_idx" ON "WardMaster"("oldWardNumber");

-- CreateIndex
CREATE INDEX "WardMaster_wardName_idx" ON "WardMaster"("wardName");

-- CreateIndex
CREATE INDEX "MohallaMaster_mohallaName_idx" ON "MohallaMaster"("mohallaName");

-- CreateIndex
CREATE INDEX "NrPropertySubCategoryMaster_propertyCategoryId_idx" ON "NrPropertySubCategoryMaster"("propertyCategoryId");

-- CreateIndex
CREATE INDEX "NrPropertySubCategoryMaster_isActive_idx" ON "NrPropertySubCategoryMaster"("isActive");

-- CreateIndex
CREATE INDEX "UsersMaster_username_idx" ON "UsersMaster"("username");

-- CreateIndex
CREATE INDEX "UsersMaster_mobileNumber_idx" ON "UsersMaster"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermissionMaster_roleName_key" ON "RolePermissionMaster"("roleName");

-- CreateIndex
CREATE UNIQUE INDEX "UlbZoneMapping_ulbId_zoneId_key" ON "UlbZoneMapping"("ulbId", "zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "ZoneWardMapping_zoneId_wardId_key" ON "ZoneWardMapping"("zoneId", "wardId");

-- CreateIndex
CREATE UNIQUE INDEX "WardMohallaMapping_wardId_mohallaId_key" ON "WardMohallaMapping"("wardId", "mohallaId");

-- CreateIndex
CREATE INDEX "SurveyorAssignment_userId_idx" ON "SurveyorAssignment"("userId");

-- CreateIndex
CREATE INDEX "SurveyorAssignment_wardId_idx" ON "SurveyorAssignment"("wardId");

-- CreateIndex
CREATE INDEX "SurveyorAssignment_isActive_idx" ON "SurveyorAssignment"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyorAssignment_userId_wardId_key" ON "SurveyorAssignment"("userId", "wardId");

-- CreateIndex
CREATE INDEX "WardStatusMapping_wardId_idx" ON "WardStatusMapping"("wardId");

-- CreateIndex
CREATE INDEX "WardStatusMapping_wardStatusId_idx" ON "WardStatusMapping"("wardStatusId");

-- CreateIndex
CREATE UNIQUE INDEX "WardStatusMapping_wardId_wardStatusId_key" ON "WardStatusMapping"("wardId", "wardStatusId");

-- CreateIndex
CREATE INDEX "SurveyStatusMapping_surveyUniqueCode_idx" ON "SurveyStatusMapping"("surveyUniqueCode");

-- CreateIndex
CREATE INDEX "SurveyStatusMapping_surveyStatusId_idx" ON "SurveyStatusMapping"("surveyStatusId");

-- CreateIndex
CREATE INDEX "SurveyStatusMapping_changedById_idx" ON "SurveyStatusMapping"("changedById");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyStatusMapping_surveyUniqueCode_surveyStatusId_key" ON "SurveyStatusMapping"("surveyUniqueCode", "surveyStatusId");

-- CreateIndex
CREATE INDEX "UserRoleMapping_userId_idx" ON "UserRoleMapping"("userId");

-- CreateIndex
CREATE INDEX "UserRoleMapping_roleId_idx" ON "UserRoleMapping"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoleMapping_userId_roleId_key" ON "UserRoleMapping"("userId", "roleId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "SurveyDetails_uploadedById_idx" ON "SurveyDetails"("uploadedById");

-- CreateIndex
CREATE INDEX "SurveyDetails_createdAt_idx" ON "SurveyDetails"("createdAt");

-- CreateIndex
CREATE INDEX "SurveyDetails_ulbId_idx" ON "SurveyDetails"("ulbId");

-- CreateIndex
CREATE INDEX "SurveyDetails_zoneId_idx" ON "SurveyDetails"("zoneId");

-- CreateIndex
CREATE INDEX "SurveyDetails_wardId_idx" ON "SurveyDetails"("wardId");

-- CreateIndex
CREATE INDEX "SurveyDetails_mohallaId_idx" ON "SurveyDetails"("mohallaId");

-- CreateIndex
CREATE INDEX "ResidentialPropertyAssessment_surveyUniqueCode_idx" ON "ResidentialPropertyAssessment"("surveyUniqueCode");

-- CreateIndex
CREATE INDEX "ResidentialPropertyAssessment_floorNumberId_idx" ON "ResidentialPropertyAssessment"("floorNumberId");

-- CreateIndex
CREATE INDEX "NonResidentialPropertyAssessment_nrPropertyCategoryId_idx" ON "NonResidentialPropertyAssessment"("nrPropertyCategoryId");

-- CreateIndex
CREATE INDEX "NonResidentialPropertyAssessment_nrSubCategoryId_idx" ON "NonResidentialPropertyAssessment"("nrSubCategoryId");

-- CreateIndex
CREATE INDEX "NonResidentialPropertyAssessment_surveyUniqueCode_idx" ON "NonResidentialPropertyAssessment"("surveyUniqueCode");

-- CreateIndex
CREATE INDEX "NonResidentialPropertyAssessment_occupancyStatusId_idx" ON "NonResidentialPropertyAssessment"("occupancyStatusId");

-- CreateIndex
CREATE INDEX "PropertyAttachmentDetails_surveyImagesId_idx" ON "PropertyAttachmentDetails"("surveyImagesId");

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
CREATE INDEX "QCSectionRecord_surveyUniqueCode_idx" ON "QCSectionRecord"("surveyUniqueCode");

-- CreateIndex
CREATE INDEX "QCSectionRecord_qcLevel_idx" ON "QCSectionRecord"("qcLevel");

-- CreateIndex
CREATE INDEX "QCSectionRecord_sectionKey_idx" ON "QCSectionRecord"("sectionKey");

-- CreateIndex
CREATE UNIQUE INDEX "QCSectionRecord_surveyUniqueCode_qcLevel_sectionKey_key" ON "QCSectionRecord"("surveyUniqueCode", "qcLevel", "sectionKey");

-- CreateIndex
CREATE INDEX "BulkActionLog_performedById_idx" ON "BulkActionLog"("performedById");

-- CreateIndex
CREATE INDEX "BulkActionLog_performedAt_idx" ON "BulkActionLog"("performedAt");

-- CreateIndex
CREATE INDEX "BulkActionLog_qcLevel_idx" ON "BulkActionLog"("qcLevel");

-- CreateIndex
CREATE UNIQUE INDEX "QCErrorTypeMaster_errorCode_key" ON "QCErrorTypeMaster"("errorCode");

-- AddForeignKey
ALTER TABLE "NrPropertySubCategoryMaster" ADD CONSTRAINT "NrPropertySubCategoryMaster_propertyCategoryId_fkey" FOREIGN KEY ("propertyCategoryId") REFERENCES "NrPropertyCategoryMaster"("propertyCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UlbZoneMapping" ADD CONSTRAINT "UlbZoneMapping_ulbId_fkey" FOREIGN KEY ("ulbId") REFERENCES "UlbMaster"("ulbId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UlbZoneMapping" ADD CONSTRAINT "UlbZoneMapping_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "ZoneMaster"("zoneId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneWardMapping" ADD CONSTRAINT "ZoneWardMapping_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "WardMaster"("wardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneWardMapping" ADD CONSTRAINT "ZoneWardMapping_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "ZoneMaster"("zoneId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WardMohallaMapping" ADD CONSTRAINT "WardMohallaMapping_mohallaId_fkey" FOREIGN KEY ("mohallaId") REFERENCES "MohallaMaster"("mohallaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WardMohallaMapping" ADD CONSTRAINT "WardMohallaMapping_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "WardMaster"("wardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyorAssignment" ADD CONSTRAINT "SurveyorAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyorAssignment" ADD CONSTRAINT "SurveyorAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyorAssignment" ADD CONSTRAINT "SurveyorAssignment_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "WardMaster"("wardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WardStatusMapping" ADD CONSTRAINT "WardStatusMapping_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WardStatusMapping" ADD CONSTRAINT "WardStatusMapping_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "WardMaster"("wardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WardStatusMapping" ADD CONSTRAINT "WardStatusMapping_wardStatusId_fkey" FOREIGN KEY ("wardStatusId") REFERENCES "WardStatusMaster"("wardStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyStatusMapping" ADD CONSTRAINT "SurveyStatusMapping_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyStatusMapping" ADD CONSTRAINT "SurveyStatusMapping_revertedFromId_fkey" FOREIGN KEY ("revertedFromId") REFERENCES "SurveyStatusMaster"("surveyStatusId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyStatusMapping" ADD CONSTRAINT "SurveyStatusMapping_surveyStatusId_fkey" FOREIGN KEY ("surveyStatusId") REFERENCES "SurveyStatusMaster"("surveyStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyStatusMapping" ADD CONSTRAINT "SurveyStatusMapping_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleMapping" ADD CONSTRAINT "UserRoleMapping_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "RolePermissionMaster"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleMapping" ADD CONSTRAINT "UserRoleMapping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UsersMaster"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surveyors" ADD CONSTRAINT "Surveyors_ulbZoneMapId_fkey" FOREIGN KEY ("ulbZoneMapId") REFERENCES "UlbZoneMapping"("ulbZoneMapId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surveyors" ADD CONSTRAINT "Surveyors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surveyors" ADD CONSTRAINT "Surveyors_wardMohallaMapId_fkey" FOREIGN KEY ("wardMohallaMapId") REFERENCES "WardMohallaMapping"("wardMohallaMapId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surveyors" ADD CONSTRAINT "Surveyors_zoneWardMapId_fkey" FOREIGN KEY ("zoneWardMapId") REFERENCES "ZoneWardMapping"("zoneWardMapId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supervisors" ADD CONSTRAINT "Supervisors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supervisors" ADD CONSTRAINT "Supervisors_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "WardMaster"("wardId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admins" ADD CONSTRAINT "Admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetails" ADD CONSTRAINT "SurveyDetails_mohallaId_fkey" FOREIGN KEY ("mohallaId") REFERENCES "MohallaMaster"("mohallaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetails" ADD CONSTRAINT "SurveyDetails_surveyTypeId_fkey" FOREIGN KEY ("surveyTypeId") REFERENCES "SurveyTypeMaster"("surveyTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetails" ADD CONSTRAINT "SurveyDetails_ulbId_fkey" FOREIGN KEY ("ulbId") REFERENCES "UlbMaster"("ulbId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetails" ADD CONSTRAINT "SurveyDetails_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetails" ADD CONSTRAINT "SurveyDetails_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "WardMaster"("wardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetails" ADD CONSTRAINT "SurveyDetails_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "ZoneMaster"("zoneId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDetails" ADD CONSTRAINT "PropertyDetails_respondentStatusId_fkey" FOREIGN KEY ("respondentStatusId") REFERENCES "RespondentStatusMaster"("respondentStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDetails" ADD CONSTRAINT "PropertyDetails_responseTypeId_fkey" FOREIGN KEY ("responseTypeId") REFERENCES "ResponseTypeMaster"("responseTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDetails" ADD CONSTRAINT "PropertyDetails_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerDetails" ADD CONSTRAINT "OwnerDetails_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_constructionTypeId_fkey" FOREIGN KEY ("constructionTypeId") REFERENCES "ConstructionTypeMaster"("constructionTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "PropertyTypeMaster"("propertyTypeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_roadTypeId_fkey" FOREIGN KEY ("roadTypeId") REFERENCES "RoadTypeMaster"("roadTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherDetails" ADD CONSTRAINT "OtherDetails_disposalTypeId_fkey" FOREIGN KEY ("disposalTypeId") REFERENCES "DisposalTypeMaster"("disposalTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherDetails" ADD CONSTRAINT "OtherDetails_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherDetails" ADD CONSTRAINT "OtherDetails_waterSourceId_fkey" FOREIGN KEY ("waterSourceId") REFERENCES "WaterSourceMaster"("waterSourceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentialPropertyAssessment" ADD CONSTRAINT "ResidentialPropertyAssessment_constructionNatureId_fkey" FOREIGN KEY ("constructionNatureId") REFERENCES "ConstructionNatureMaster"("constructionNatureId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentialPropertyAssessment" ADD CONSTRAINT "ResidentialPropertyAssessment_floorNumberId_fkey" FOREIGN KEY ("floorNumberId") REFERENCES "FloorMaster"("floorNumberId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentialPropertyAssessment" ADD CONSTRAINT "ResidentialPropertyAssessment_occupancyStatusId_fkey" FOREIGN KEY ("occupancyStatusId") REFERENCES "OccupancyStatusMaster"("occupancyStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentialPropertyAssessment" ADD CONSTRAINT "ResidentialPropertyAssessment_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_constructionNatureId_fkey" FOREIGN KEY ("constructionNatureId") REFERENCES "ConstructionNatureMaster"("constructionNatureId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_floorNumberId_fkey" FOREIGN KEY ("floorNumberId") REFERENCES "FloorMaster"("floorNumberId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_nrPropertyCategoryId_fkey" FOREIGN KEY ("nrPropertyCategoryId") REFERENCES "NrPropertyCategoryMaster"("propertyCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_nrSubCategoryId_fkey" FOREIGN KEY ("nrSubCategoryId") REFERENCES "NrPropertySubCategoryMaster"("subCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_occupancyStatusId_fkey" FOREIGN KEY ("occupancyStatusId") REFERENCES "OccupancyStatusMaster"("occupancyStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAttachmentDetails" ADD CONSTRAINT "PropertyAttachmentDetails_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCRecord" ADD CONSTRAINT "QCRecord_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCRecord" ADD CONSTRAINT "QCRecord_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCRecord" ADD CONSTRAINT "QCRecord_bulkActionId_fkey" FOREIGN KEY ("bulkActionId") REFERENCES "BulkActionLog"("bulkActionId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCSectionRecord" ADD CONSTRAINT "QCSectionRecord_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCSectionRecord" ADD CONSTRAINT "QCSectionRecord_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulkActionLog" ADD CONSTRAINT "BulkActionLog_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
