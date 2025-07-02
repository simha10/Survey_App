"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSurvey = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createSurvey = (surveyData, uploadedById) => __awaiter(void 0, void 0, void 0, function* () {
    const { surveyDetails, propertyDetails, ownerDetails, locationDetails, otherDetails, residentialPropertyAssessments, nonResidentialPropertyAssessments } = surveyData;
    return prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const locationCreate = {
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
        if (locationDetails.buildingName)
            locationCreate.buildingName = locationDetails.buildingName;
        if (locationDetails.addressRoadName)
            locationCreate.addressRoadName = locationDetails.addressRoadName;
        if (locationDetails.landmark)
            locationCreate.landmark = locationDetails.landmark;
        if (locationDetails.fourWayEast)
            locationCreate.fourWayEast = locationDetails.fourWayEast;
        if (locationDetails.fourWayWest)
            locationCreate.fourWayWest = locationDetails.fourWayWest;
        if (locationDetails.fourWayNorth)
            locationCreate.fourWayNorth = locationDetails.fourWayNorth;
        if (locationDetails.fourWaySouth)
            locationCreate.fourWaySouth = locationDetails.fourWaySouth;
        const newSurvey = yield tx.surveyDetails.create({
            data: Object.assign(Object.assign({}, surveyDetails), { uploadedById, propertyDetails: {
                    create: propertyDetails,
                }, ownerDetails: {
                    create: ownerDetails,
                }, locationDetails: {
                    create: locationCreate,
                }, otherDetails: {
                    create: Object.assign(Object.assign({}, otherDetails), { rainWaterHarvestingSystem: (_a = otherDetails.rainWaterHarvestingSystem) !== null && _a !== void 0 ? _a : '', waterSupplyWithin200Meters: (_b = otherDetails.waterSupplyWithin200Meters) !== null && _b !== void 0 ? _b : '', sewerageLineWithin100Meters: (_c = otherDetails.sewerageLineWithin100Meters) !== null && _c !== void 0 ? _c : '', plantation: (_d = otherDetails.plantation) !== null && _d !== void 0 ? _d : null, parking: (_e = otherDetails.parking) !== null && _e !== void 0 ? _e : null, pollution: (_f = otherDetails.pollution) !== null && _f !== void 0 ? _f : null, pollutionMeasurementTaken: (_g = otherDetails.pollutionMeasurementTaken) !== null && _g !== void 0 ? _g : null, remarks: (_h = otherDetails.remarks) !== null && _h !== void 0 ? _h : null }),
                }, residentialPropertyAssessments: residentialPropertyAssessments && residentialPropertyAssessments.length > 0
                    ? { create: residentialPropertyAssessments }
                    : undefined, nonResidentialPropertyAssessments: nonResidentialPropertyAssessments && nonResidentialPropertyAssessments.length > 0
                    ? { create: nonResidentialPropertyAssessments }
                    : undefined }),
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
    }));
});
exports.createSurvey = createSurvey;
