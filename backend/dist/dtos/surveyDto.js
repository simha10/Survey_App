"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSurveyDtoSchema = void 0;
const zod_1 = require("zod");
const YesNoSchema = zod_1.z.enum(['YES', 'NO']);
const SurveyDetailsSchema = zod_1.z.object({
    ulbId: zod_1.z.string().uuid(),
    zoneId: zod_1.z.string().uuid(),
    wardId: zod_1.z.string().uuid(),
    mohallaId: zod_1.z.string().uuid(),
    surveyTypeId: zod_1.z.number().int().positive(),
    entryDate: zod_1.z.string().datetime(),
    parcelId: zod_1.z.number().optional().nullable(),
    mapId: zod_1.z.number(),
    gisId: zod_1.z.string().max(12),
    subGisId: zod_1.z.string().max(15).optional().nullable(),
});
const PropertyDetailsSchema = zod_1.z.object({
    responseTypeId: zod_1.z.number().int().positive(),
    oldHouseNumber: zod_1.z.string().max(15).optional().nullable(),
    electricityConsumerName: zod_1.z.string().max(50).optional().nullable(),
    waterSewerageConnectionNumber: zod_1.z.string().max(50).optional().nullable(),
    respondentName: zod_1.z.string().max(50),
    respondentStatusId: zod_1.z.number().int().positive(),
});
const OwnerDetailsSchema = zod_1.z.object({
    ownerName: zod_1.z.string().max(50),
    fatherHusbandName: zod_1.z.string().max(50),
    mobileNumber: zod_1.z.string().max(20).optional().nullable(),
    aadharNumber: zod_1.z.string().length(12).optional().nullable(),
});
const LocationDetailsSchema = zod_1.z.object({
    propertyLatitude: zod_1.z.number().min(0).max(180).optional().nullable(),
    propertyLongitude: zod_1.z.number().min(0).max(360).optional().nullable(),
    assessmentYear: zod_1.z.string().max(20),
    propertyTypeId: zod_1.z.number().int().positive(),
    buildingName: zod_1.z.string().optional().nullable(),
    roadTypeId: zod_1.z.number().int().positive(),
    constructionYear: zod_1.z.string().max(20),
    constructionTypeId: zod_1.z.number().int().positive(),
    addressRoadName: zod_1.z.string(),
    locality: zod_1.z.string().optional().nullable(),
    pinCode: zod_1.z.number(),
    landmark: zod_1.z.string().optional().nullable(),
    fourWayEast: zod_1.z.string().optional().nullable(),
    fourWayWest: zod_1.z.string().optional().nullable(),
    fourWayNorth: zod_1.z.string().optional().nullable(),
    fourWaySouth: zod_1.z.string().optional().nullable(),
    newWardNumber: zod_1.z.string().max(20),
});
const OtherDetailsSchema = zod_1.z.object({
    waterSourceId: zod_1.z.number().int().positive(),
    rainWaterHarvestingSystem: YesNoSchema,
    plantation: YesNoSchema.optional().nullable(),
    parking: YesNoSchema.optional().nullable(),
    pollution: YesNoSchema.optional().nullable(),
    pollutionMeasurementTaken: zod_1.z.string().optional().nullable(),
    waterSupplyWithin200Meters: YesNoSchema,
    sewerageLineWithin100Meters: YesNoSchema,
    disposalTypeId: zod_1.z.number().int().positive(),
    totalPlotArea: zod_1.z.number(),
    builtupAreaOfGroundFloor: zod_1.z.number(),
    remarks: zod_1.z.string().optional().nullable(),
});
// Residential Floor Details
// All fields marked * are mandatory as per requirements
const ResidentialPropertyAssessmentSchema = zod_1.z.object({
    floorNumberId: zod_1.z.number().int().positive(), // Floor Number (from Floor Number Master)
    occupancyStatusId: zod_1.z.number().int().positive(), // Occupancy Status (from Occupancy Status Master)
    constructionNatureId: zod_1.z.number().int().positive(), // Construction Nature (from Construction Nature Master)
    coveredArea: zod_1.z.number(), // Covered Area (manual entry)
    allRoomVerandaArea: zod_1.z.number().optional().nullable(), // Total Rooms/Veranda Area (manual entry)
    allBalconyKitchenArea: zod_1.z.number().optional().nullable(), // Total Balcony/Kitchen Area (manual entry)
    allGarageArea: zod_1.z.number().optional().nullable(), // All Garage Area (manual entry)
    carpetArea: zod_1.z.number(), // Carpet Area (manual entry)
});
// Non-Residential Floor Details
// All fields marked * are mandatory as per requirements
const NonResidentialPropertyAssessmentSchema = zod_1.z.object({
    floorNumberId: zod_1.z.number().int().positive(), // Floor Number (from Floor Number Master)
    nrPropertyCategoryId: zod_1.z.number().int().positive(), // Property Category (from NR Property Category Master)
    nrSubCategoryId: zod_1.z.number().int().positive(), // Property Sub Category (from NR Property Sub Category Master)
    establishmentName: zod_1.z.string(), // Establishment Name (manual entry)
    licenseNo: zod_1.z.string().max(20).optional().nullable(), // License Number (manual entry, optional)
    licenseExpiryDate: zod_1.z.string().datetime().optional().nullable(), // License Expiry Date (manual entry, optional)
    occupancyStatusId: zod_1.z.number().int().positive(), // Occupancy Status (from Occupancy Status Master)
    constructionNatureId: zod_1.z.number().int().positive(), // Construction Nature (from Construction Nature Master)
    builtupArea: zod_1.z.number(), // Built-up Area (manual entry)
});
exports.CreateSurveyDtoSchema = zod_1.z.object({
    surveyDetails: SurveyDetailsSchema,
    propertyDetails: PropertyDetailsSchema,
    ownerDetails: OwnerDetailsSchema,
    locationDetails: LocationDetailsSchema,
    otherDetails: OtherDetailsSchema,
    residentialPropertyAssessments: zod_1.z.array(ResidentialPropertyAssessmentSchema).optional().nullable(),
    nonResidentialPropertyAssessments: zod_1.z.array(NonResidentialPropertyAssessmentSchema).optional().nullable(),
});
