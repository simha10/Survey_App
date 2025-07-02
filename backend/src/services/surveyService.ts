import { PrismaClient } from '@prisma/client';
import { CreateSurveyDto } from '../dtos/surveyDto';

const prisma = new PrismaClient();

export const createSurvey = async (surveyData: CreateSurveyDto, uploadedById: string) => {
  const { surveyDetails, propertyDetails, ownerDetails, locationDetails, otherDetails, residentialPropertyAssessments, nonResidentialPropertyAssessments } = surveyData;

  return prisma.$transaction(async (tx) => {
    const locationCreate: any = {
      propertyLatitude: locationDetails.propertyLatitude,
      propertyLongitude: locationDetails.propertyLongitude,
      assessmentYear: locationDetails.assessmentYear,
      propertyTypeId: locationDetails.propertyTypeId,
      roadTypeId: locationDetails.roadTypeId,
      constructionYear: locationDetails.constructionYear,
      constructionTypeId: locationDetails.constructionTypeId,
      locality: locationDetails.locality,
      pinCode: locationDetails.pinCode,
      newWardNumber: locationDetails.newWardNumber,
    };
    if (locationDetails.buildingName) locationCreate.buildingName = locationDetails.buildingName;
    if (locationDetails.addressRoadName) locationCreate.addressRoadName = locationDetails.addressRoadName;
    if (locationDetails.landmark) locationCreate.landmark = locationDetails.landmark;
    if (locationDetails.fourWayEast) locationCreate.fourWayEast = locationDetails.fourWayEast;
    if (locationDetails.fourWayWest) locationCreate.fourWayWest = locationDetails.fourWayWest;
    if (locationDetails.fourWayNorth) locationCreate.fourWayNorth = locationDetails.fourWayNorth;
    if (locationDetails.fourWaySouth) locationCreate.fourWaySouth = locationDetails.fourWaySouth;

    const newSurvey = await tx.surveyDetails.create({
      data: {
        ...surveyDetails,
        uploadedById,
        propertyDetails: {
          create: propertyDetails,
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
        residentialPropertyAssessments: residentialPropertyAssessments && residentialPropertyAssessments.length > 0
          ? { create: residentialPropertyAssessments }
          : undefined,
        nonResidentialPropertyAssessments: nonResidentialPropertyAssessments && nonResidentialPropertyAssessments.length > 0
          ? { create: nonResidentialPropertyAssessments }
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