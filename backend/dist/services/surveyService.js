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
    const { surveyDetails, propertyDetails, ownerDetails, locationDetails, otherDetails } = surveyData;
    return prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const newSurvey = yield tx.surveyDetails.create({
            data: Object.assign(Object.assign({}, surveyDetails), { uploadedById, propertyDetails: {
                    create: propertyDetails,
                }, ownerDetails: {
                    create: ownerDetails,
                }, locationDetails: {
                    create: Object.assign(Object.assign({}, locationDetails), { propertyLatitude: locationDetails.propertyLatitude, propertyLongitude: locationDetails.propertyLongitude }),
                }, otherDetails: {
                    create: otherDetails,
                } }),
            include: {
                propertyDetails: true,
                ownerDetails: true,
                locationDetails: true,
                otherDetails: true,
            },
        });
        return newSurvey;
    }));
});
exports.createSurvey = createSurvey;
