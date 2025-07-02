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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSurvey = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function cleanAssessment(assessment) {
    const _a = assessment, { id } = _a, rest = __rest(_a, ["id"]);
    // Remove undefined fields
    Object.keys(rest).forEach((key) => {
        if (rest[key] === undefined) {
            delete rest[key];
        }
    });
    return rest;
}
const createSurvey = (surveyData, uploadedById) => __awaiter(void 0, void 0, void 0, function* () {
    const { surveyDetails, propertyDetails, ownerDetails, locationDetails, otherDetails, residentialPropertyAssessments, nonResidentialPropertyAssessments } = surveyData;
    // Clean residential assessments: remove 'id' and undefined fields
    const cleanResidentialAssessments = residentialPropertyAssessments
        ? residentialPropertyAssessments.map(cleanAssessment)
        : undefined;
    // Clean non-residential assessments: remove 'id' and undefined fields
    const cleanNonResidentialAssessments = nonResidentialPropertyAssessments
        ? nonResidentialPropertyAssessments.map(cleanAssessment)
        : undefined;
    return prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const locationCreate = {
            propertyLatitude: locationDetails.propertyLatitude,
            propertyLongitude: locationDetails.propertyLongitude,
            assessmentYear: locationDetails.assessmentYear,
            constructionYear: locationDetails.constructionYear,
            locality: locationDetails.locality,
            pinCode: locationDetails.pinCode,
            newWardNumber: locationDetails.newWardNumber,
            propertyType: { connect: { propertyTypeId: locationDetails.propertyTypeId } },
            roadType: { connect: { roadTypeId: locationDetails.roadTypeId } },
            constructionType: { connect: { constructionTypeId: locationDetails.constructionTypeId } },
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
        const propertyDetailsCreate = Object.assign(Object.assign({}, propertyDetails), { responseType: { connect: { responseTypeId: propertyDetails.responseTypeId } }, respondentStatus: { connect: { respondentStatusId: propertyDetails.respondentStatusId } } });
        delete propertyDetailsCreate.responseTypeId;
        delete propertyDetailsCreate.respondentStatusId;
        const otherDetailsCreate = Object.assign(Object.assign({}, otherDetails), { waterSource: { connect: { waterSourceId: otherDetails.waterSourceId } }, disposalType: { connect: { disposalTypeId: otherDetails.disposalTypeId } } });
        delete otherDetailsCreate.waterSourceId;
        delete otherDetailsCreate.disposalTypeId;
        const cleanResidentialAssessments = residentialPropertyAssessments
            ? residentialPropertyAssessments.map(assessment => {
                const cleaned = cleanAssessment(assessment);
                const { floorNumberId, occupancyStatusId, constructionNatureId } = cleaned, rest = __rest(cleaned, ["floorNumberId", "occupancyStatusId", "constructionNatureId"]);
                return Object.assign(Object.assign({}, rest), { floorMaster: { connect: { floorNumberId } }, occupancyStatus: { connect: { occupancyStatusId } }, constructionNature: { connect: { constructionNatureId } } });
            })
            : undefined;
        const cleanNonResidentialAssessments = nonResidentialPropertyAssessments
            ? nonResidentialPropertyAssessments.map(assessment => {
                const cleaned = cleanAssessment(assessment);
                const { floorNumberId, nrPropertyCategoryId, nrSubCategoryId, occupancyStatusId, constructionNatureId } = cleaned, rest = __rest(cleaned, ["floorNumberId", "nrPropertyCategoryId", "nrSubCategoryId", "occupancyStatusId", "constructionNatureId"]);
                return Object.assign(Object.assign({}, rest), { floorMaster: { connect: { floorNumberId } }, nrPropertyCategory: { connect: { propertyCategoryId: nrPropertyCategoryId } }, nrSubCategory: { connect: { subCategoryId: nrSubCategoryId } }, occupancyStatus: { connect: { occupancyStatusId } }, constructionNature: { connect: { constructionNatureId } } });
            })
            : undefined;
        const surveyDetailsCreate = Object.assign(Object.assign({}, surveyDetails), { ulb: { connect: { ulbId: surveyDetails.ulbId } }, zone: { connect: { zoneId: surveyDetails.zoneId } }, ward: { connect: { wardId: surveyDetails.wardId } }, mohalla: { connect: { mohallaId: surveyDetails.mohallaId } }, surveyType: { connect: { surveyTypeId: surveyDetails.surveyTypeId } } });
        delete surveyDetailsCreate.ulbId;
        delete surveyDetailsCreate.zoneId;
        delete surveyDetailsCreate.wardId;
        delete surveyDetailsCreate.mohallaId;
        delete surveyDetailsCreate.surveyTypeId;
        delete surveyDetailsCreate.uploadedBy;
        const newSurvey = yield tx.surveyDetails.create({
            data: Object.assign(Object.assign({}, surveyDetailsCreate), { uploadedBy: { connect: { userId: uploadedById } }, propertyDetails: {
                    create: propertyDetailsCreate,
                }, ownerDetails: {
                    create: ownerDetails,
                }, locationDetails: {
                    create: locationCreate,
                }, otherDetails: {
                    create: otherDetailsCreate,
                }, residentialPropertyAssessments: cleanResidentialAssessments && cleanResidentialAssessments.length > 0
                    ? { create: cleanResidentialAssessments }
                    : undefined, nonResidentialPropertyAssessments: cleanNonResidentialAssessments && cleanNonResidentialAssessments.length > 0
                    ? { create: cleanNonResidentialAssessments }
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
