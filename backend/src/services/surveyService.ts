import { PrismaClient } from '@prisma/client';
import { CreateSurveyDto } from '../dtos/surveyDto';

const prisma = new PrismaClient();

export const createSurvey = async (surveyData: CreateSurveyDto, uploadedById: string) => {
  const { surveyDetails, propertyDetails, ownerDetails, locationDetails, otherDetails, residentialPropertyAssessments, nonResidentialPropertyAssessments } = surveyData;

  return prisma.$transaction(async (tx) => {
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
          create: {
            ...locationDetails,
            propertyLatitude: locationDetails.propertyLatitude,
            propertyLongitude: locationDetails.propertyLongitude,
            newWardNumber: locationDetails.newWardNumber,
          },
        },
        otherDetails: {
          create: otherDetails,
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