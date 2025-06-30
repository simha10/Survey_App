import { z } from 'zod';

const YesNoSchema = z.enum(['YES', 'NO']);

const SurveyDetailsSchema = z.object({
  ulbId: z.string().uuid(),
  zoneId: z.string().uuid(),
  wardId: z.string().uuid(),
  mohallaId: z.string().uuid(),
  surveyTypeId: z.number().int().positive(),
  entryDate: z.string().datetime(),
  parcelId: z.number().optional(),
  mapId: z.number(),
  gisId: z.string().max(12),
  subGisId: z.string().max(15).optional(),
});

const PropertyDetailsSchema = z.object({
  responseTypeId: z.number().int().positive(),
  oldHouseNumber: z.string().max(15).optional(),
  electricityConsumerName: z.string().max(50).optional(),
  waterSewerageConnectionNumber: z.string().max(50).optional(),
  respondentName: z.string().max(50),
  respondentStatusId: z.number().int().positive(),
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
  propertyTypeId: z.number().int().positive(),
  buildingName: z.string().optional(),
  roadTypeId: z.number().int().positive(),
  constructionYear: z.string().max(20),
  constructionTypeId: z.number().int().positive(),
  addressRoadName: z.string(),
  locality: z.string().optional(),
  pinCode: z.number(),
  landmark: z.string().optional(),
  fourWayEast: z.string().optional(),
  fourWayWest: z.string().optional(),
  fourWayNorth: z.string().optional(),
  fourWaySouth: z.string().optional(),
  newWardNumber: z.string().max(20),
});

const OtherDetailsSchema = z.object({
  waterSourceId: z.number().int().positive(),
  rainWaterHarvestingSystem: YesNoSchema.optional(),
  plantation: YesNoSchema.optional(),
  parking: YesNoSchema.optional(),
  pollution: YesNoSchema.optional(),
  pollutionMeasurementTaken: z.string().optional(),
  waterSupplyWithin200Meters: YesNoSchema.optional(),
  sewerageLineWithin100Meters: YesNoSchema.optional(),
  disposalTypeId: z.number().int().positive(),
  totalPlotArea: z.number(),
  builtupAreaOfGroundFloor: z.number(),
  remarks: z.string().optional(),
});

// Residential Floor Details
// All fields marked * are mandatory as per requirements
const ResidentialPropertyAssessmentSchema = z.object({
  floorNumberId: z.number().int().positive(), // Floor Number (from Floor Number Master)
  occupancyStatusId: z.number().int().positive(), // Occupancy Status (from Occupancy Status Master)
  constructionNatureId: z.number().int().positive(), // Construction Nature (from Construction Nature Master)
  coveredArea: z.number(), // Covered Area (manual entry)
  allRoomVerandaArea: z.number(), // Total Rooms/Veranda Area (manual entry)
  allBalconyKitchenArea: z.number(), // Total Balcony/Kitchen Area (manual entry)
  allGarageArea: z.number(), // All Garage Area (manual entry)
  carpetArea: z.number(), // Carpet Area (manual entry)
});

// Non-Residential Floor Details
// All fields marked * are mandatory as per requirements
const NonResidentialPropertyAssessmentSchema = z.object({
  floorNumberId: z.number().int().positive(), // Floor Number (from Floor Number Master)
  nrPropertyCategoryId: z.number().int().positive(), // Property Category (from NR Property Category Master)
  nrSubCategoryId: z.number().int().positive(), // Property Sub Category (from NR Property Sub Category Master)
  establishmentName: z.string(), // Establishment Name (manual entry)
  licenseNo: z.string().max(20).optional(), // License Number (manual entry, optional)
  licenseExpiryDate: z.string().datetime().optional(), // License Expiry Date (manual entry, optional)
  occupancyStatusId: z.number().int().positive(), // Occupancy Status (from Occupancy Status Master)
  constructionNatureId: z.number().int().positive(), // Construction Nature (from Construction Nature Master)
  builtupArea: z.number(), // Built-up Area (manual entry)
});

export const CreateSurveyDtoSchema = z.object({
  surveyDetails: SurveyDetailsSchema,
  propertyDetails: PropertyDetailsSchema,
  ownerDetails: OwnerDetailsSchema,
  locationDetails: LocationDetailsSchema,
  otherDetails: OtherDetailsSchema,
  residentialPropertyAssessments: z.array(ResidentialPropertyAssessmentSchema).optional(),
  nonResidentialPropertyAssessments: z.array(NonResidentialPropertyAssessmentSchema).optional(),
});

export type CreateSurveyDto = z.infer<typeof CreateSurveyDtoSchema>; 