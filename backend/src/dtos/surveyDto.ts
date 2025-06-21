import { z } from 'zod';

const YesNoSchema = z.enum(['YES', 'NO']);

const SurveyDetailsSchema = z.object({
  ulbId: z.string().uuid(),
  zoneId: z.string().uuid(),
  wardId: z.string().uuid(),
  mohallaId: z.string().uuid(),
  surveyTypeId: z.string().uuid(),
  entryDate: z.string().datetime(),
  parcelId: z.number().optional(),
  mapId: z.number(),
  gisId: z.string().max(12),
  subGisId: z.string().max(15).optional(),
});

const PropertyDetailsSchema = z.object({
  responseTypeId: z.string().uuid(),
  oldHouseNumber: z.string().max(15).optional(),
  electricityConsumerName: z.string().max(50).optional(),
  waterSewerageConnectionNumber: z.string().max(50).optional(),
  respondentName: z.string().max(50),
  respondentStatusId: z.string().uuid(),
});

const OwnerDetailsSchema = z.object({
  ownerName: z.string().max(50),
  fatherHusbandName: z.string().max(50),
  mobileNumber: z.string().max(20).optional(),
  aadharNumber: z.string().length(12).optional(),
});

const LocationDetailsSchema = z.object({
  propertyLatitude: z.number(),
  propertyLongitude: z.number(),
  assessmentYear: z.string().max(20),
  propertyTypeId: z.string().uuid(),
  buildingName: z.string().optional(),
  roadTypeId: z.string().uuid(),
  constructionYear: z.string().max(20),
  constructionTypeId: z.string().uuid(),
  addressRoadName: z.string(),
  locality: z.string().optional(),
  pinCode: z.number(),
  landmark: z.string().optional(),
  fourWayEast: z.string().optional(),
  fourWayWest: z.string().optional(),
  fourWayNorth: z.string().optional(),
  fourWaySouth: z.string().optional(),
  newWard: z.string().max(20),
});

const OtherDetailsSchema = z.object({
  waterSourceId: z.string().uuid(),
  rainWaterHarvestingSystem: YesNoSchema.optional(),
  plantation: YesNoSchema.optional(),
  parking: YesNoSchema.optional(),
  pollution: YesNoSchema.optional(),
  pollutionMeasurementTaken: z.string().optional(),
  waterSupplyWithin200Meters: YesNoSchema.optional(),
  sewerageLineWithin100Meters: YesNoSchema.optional(),
  disposalTypeId: z.string().uuid(),
  totalPlotArea: z.number(),
  builtupAreaOfGroundFloor: z.number(),
  remarks: z.string().optional(),
});


export const CreateSurveyDtoSchema = z.object({
  surveyDetails: SurveyDetailsSchema,
  propertyDetails: PropertyDetailsSchema,
  ownerDetails: OwnerDetailsSchema,
  locationDetails: LocationDetailsSchema,
  otherDetails: OtherDetailsSchema,
});

export type CreateSurveyDto = z.infer<typeof CreateSurveyDtoSchema>; 