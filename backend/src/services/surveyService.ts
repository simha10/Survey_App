import { PrismaClient, Prisma } from '@prisma/client';
import { CreateSurveyDto } from '../dtos/surveyDto';

const prisma = new PrismaClient();

function cleanAssessment<T extends object>(assessment: T): Omit<T, 'id'> {
  const { id, ...rest } = assessment as any;
  // Remove undefined fields
  Object.keys(rest).forEach((key) => {
    if (rest[key] === undefined) {
      delete rest[key];
    }
  });
  return rest;
}

export const createSurvey = async (surveyData: CreateSurveyDto, uploadedById: string) => {
  const { surveyDetails, propertyDetails, ownerDetails, locationDetails, otherDetails, residentialPropertyAssessments, nonResidentialPropertyAssessments } = surveyData;

  // Clean residential assessments: remove 'id' and undefined fields
  const cleanResidentialAssessments = residentialPropertyAssessments
    ? residentialPropertyAssessments.map(cleanAssessment)
    : undefined;

  // Clean non-residential assessments: remove 'id' and undefined fields
  const cleanNonResidentialAssessments = nonResidentialPropertyAssessments
    ? nonResidentialPropertyAssessments.map(cleanAssessment)
    : undefined;

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const locationCreate: any = {
      propertyLatitude: locationDetails.propertyLatitude,
      propertyLongitude: locationDetails.propertyLongitude,
      assessmentYear: locationDetails.assessmentYear,
      constructionYear: locationDetails.constructionYear,
      locality: locationDetails.locality,
      pinCode: locationDetails.pinCode,
      newWardNumber: locationDetails.newWardNumber,
      roadType: { connect: { roadTypeId: locationDetails.roadTypeId } },
      constructionType: { connect: { constructionTypeId: locationDetails.constructionTypeId } },
    };
    if (locationDetails.propertyTypeId) {
      locationCreate.propertyType = { connect: { propertyTypeId: locationDetails.propertyTypeId } };
    }
    if (locationDetails.buildingName) locationCreate.buildingName = locationDetails.buildingName;
    if (locationDetails.addressRoadName) locationCreate.addressRoadName = locationDetails.addressRoadName;
    if (locationDetails.landmark) locationCreate.landmark = locationDetails.landmark;
    if (locationDetails.fourWayEast) locationCreate.fourWayEast = locationDetails.fourWayEast;
    if (locationDetails.fourWayWest) locationCreate.fourWayWest = locationDetails.fourWayWest;
    if (locationDetails.fourWayNorth) locationCreate.fourWayNorth = locationDetails.fourWayNorth;
    if (locationDetails.fourWaySouth) locationCreate.fourWaySouth = locationDetails.fourWaySouth;

    const propertyDetailsCreate: any = {
      ...propertyDetails,
      responseType: { connect: { responseTypeId: propertyDetails.responseTypeId } },
      respondentStatus: { connect: { respondentStatusId: propertyDetails.respondentStatusId } },
    };
    delete propertyDetailsCreate.responseTypeId;
    delete propertyDetailsCreate.respondentStatusId;

    const otherDetailsCreate: any = {
      ...otherDetails,
      waterSource: { connect: { waterSourceId: otherDetails.waterSourceId } },
      disposalType: { connect: { disposalTypeId: otherDetails.disposalTypeId } },
    };
    delete otherDetailsCreate.waterSourceId;
    delete otherDetailsCreate.disposalTypeId;

    const cleanResidentialAssessments = residentialPropertyAssessments
      ? residentialPropertyAssessments.map(assessment => {
          const cleaned = cleanAssessment(assessment);
          const { floorNumberId, occupancyStatusId, constructionNatureId, ...rest } = cleaned;
          return {
            ...rest,
            floorMaster: { connect: { floorNumberId } },
            occupancyStatus: { connect: { occupancyStatusId } },
            constructionNature: { connect: { constructionNatureId } },
          };
        })
      : undefined;

    const cleanNonResidentialAssessments = nonResidentialPropertyAssessments
      ? nonResidentialPropertyAssessments.map(assessment => {
          const cleaned = cleanAssessment(assessment);
          const { floorNumberId, nrPropertyCategoryId, nrSubCategoryId, occupancyStatusId, constructionNatureId, ...rest } = cleaned;
          return {
            ...rest,
            floorMaster: { connect: { floorNumberId } },
            nrPropertyCategory: { connect: { propertyCategoryId: nrPropertyCategoryId } },
            nrSubCategory: { connect: { subCategoryId: nrSubCategoryId } },
            occupancyStatus: { connect: { occupancyStatusId } },
            constructionNature: { connect: { constructionNatureId } },
          };
        })
      : undefined;

    const surveyDetailsCreate: any = {
      ...surveyDetails,
      ulb: { connect: { ulbId: surveyDetails.ulbId } },
      zone: { connect: { zoneId: surveyDetails.zoneId } },
      ward: { connect: { wardId: surveyDetails.wardId } },
      mohalla: { connect: { mohallaId: surveyDetails.mohallaId } },
      surveyType: { connect: { surveyTypeId: surveyDetails.surveyTypeId } },
    };
    delete surveyDetailsCreate.ulbId;
    delete surveyDetailsCreate.zoneId;
    delete surveyDetailsCreate.wardId;
    delete surveyDetailsCreate.mohallaId;
    delete surveyDetailsCreate.surveyTypeId;
    delete surveyDetailsCreate.uploadedBy;

    const newSurvey = await tx.surveyDetails.create({
      data: {
        ...surveyDetailsCreate,
        uploadedBy: { connect: { userId: uploadedById } },
        propertyDetails: {
          create: propertyDetailsCreate,
        },
        ownerDetails: {
          create: ownerDetails,
        },
        locationDetails: {
          create: locationCreate,
        },
        otherDetails: {
          create: {
            ...otherDetails,
            rainWaterHarvestingSystem: otherDetails.rainWaterHarvestingSystem ?? '',
            waterSupplyWithin200Meters: otherDetails.waterSupplyWithin200Meters ?? '',
            sewerageLineWithin100Meters: otherDetails.sewerageLineWithin100Meters ?? '',
            plantation: otherDetails.plantation ?? null,
            parking: otherDetails.parking ?? null,
            pollution: otherDetails.pollution ?? null,
            pollutionMeasurementTaken: otherDetails.pollutionMeasurementTaken ?? null,
            remarks: otherDetails.remarks ?? null,
          },
        },
        residentialPropertyAssessments: cleanResidentialAssessments && cleanResidentialAssessments.length > 0
          ? { create: cleanResidentialAssessments as any }
          : undefined,
        nonResidentialPropertyAssessments: cleanNonResidentialAssessments && cleanNonResidentialAssessments.length > 0
          ? { create: cleanNonResidentialAssessments as any }
          : undefined,
      },
      include: {
        
        propertyDetails: true,
        ownerDetails: true,
        locationDetails: true,
        otherDetails: true,
        residentialPropertyAssessments: true,
        nonResidentialPropertyAssessments: true,
      },
    });

    return newSurvey;
  });
}; 