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
exports.getAllMasterData = exports.getSurveyTypes = exports.getOccupancyStatuses = exports.getConstructionNatures = exports.getNrPropertySubCategories = exports.getNrPropertyCategories = exports.getFloors = exports.getDisposalTypes = exports.getWaterSources = exports.getConstructionTypes = exports.getRoadTypes = exports.getRespondentStatuses = exports.getPropertyTypes = exports.getResponseTypes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getResponseTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const responseTypes = yield prisma.responseTypeMaster.findMany({
            where: { isActive: true },
            select: {
                responseTypeId: true,
                responseTypeName: true,
                description: true,
            },
            orderBy: { responseTypeName: 'asc' },
        });
        res.json(responseTypes);
    }
    catch (error) {
        console.error('Error fetching response types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getResponseTypes = getResponseTypes;
const getPropertyTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyTypes = yield prisma.propertyTypeMaster.findMany({
            where: { isActive: true },
            select: {
                propertyTypeId: true,
                propertyTypeName: true,
                description: true,
            },
            orderBy: { propertyTypeName: 'asc' },
        });
        res.json(propertyTypes);
    }
    catch (error) {
        console.error('Error fetching property types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getPropertyTypes = getPropertyTypes;
const getRespondentStatuses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const respondentStatuses = yield prisma.respondentStatusMaster.findMany({
            where: { isActive: true },
            select: {
                respondentStatusId: true,
                respondentStatusName: true,
                description: true,
            },
            orderBy: { respondentStatusName: 'asc' },
        });
        res.json(respondentStatuses);
    }
    catch (error) {
        console.error('Error fetching respondent statuses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getRespondentStatuses = getRespondentStatuses;
const getRoadTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roadTypes = yield prisma.roadTypeMaster.findMany({
            where: { isActive: true },
            select: {
                roadTypeId: true,
                roadTypeName: true,
                description: true,
            },
            orderBy: { roadTypeName: 'asc' },
        });
        res.json(roadTypes);
    }
    catch (error) {
        console.error('Error fetching road types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getRoadTypes = getRoadTypes;
const getConstructionTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const constructionTypes = yield prisma.constructionTypeMaster.findMany({
            where: { isActive: true },
            select: {
                constructionTypeId: true,
                constructionTypeName: true,
                description: true,
            },
            orderBy: { constructionTypeName: 'asc' },
        });
        res.json(constructionTypes);
    }
    catch (error) {
        console.error('Error fetching construction types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getConstructionTypes = getConstructionTypes;
const getWaterSources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const waterSources = yield prisma.waterSourceMaster.findMany({
            where: { isActive: true },
            select: {
                waterSourceId: true,
                waterSourceName: true,
                description: true,
            },
            orderBy: { waterSourceName: 'asc' },
        });
        res.json(waterSources);
    }
    catch (error) {
        console.error('Error fetching water sources:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getWaterSources = getWaterSources;
const getDisposalTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const disposalTypes = yield prisma.disposalTypeMaster.findMany({
            where: { isActive: true },
            select: {
                disposalTypeId: true,
                disposalTypeName: true,
                description: true,
            },
            orderBy: { disposalTypeName: 'asc' },
        });
        res.json(disposalTypes);
    }
    catch (error) {
        console.error('Error fetching disposal types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getDisposalTypes = getDisposalTypes;
const getFloors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const floors = yield prisma.floorMaster.findMany({
            where: { isActive: true },
            select: {
                floorNumberId: true,
                floorNumberName: true,
                description: true,
            },
            orderBy: { floorNumberId: 'asc' },
        });
        res.json(floors);
    }
    catch (error) {
        console.error('Error fetching floors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getFloors = getFloors;
const getNrPropertyCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma.nrPropertyCategoryMaster.findMany({
            where: { isActive: true },
            select: {
                propertyCategoryId: true,
                propertyCategoryNumber: true,
                propertyCategoryName: true,
                description: true,
            },
            orderBy: { propertyCategoryNumber: 'asc' },
        });
        res.json(categories);
    }
    catch (error) {
        console.error('Error fetching NR property categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getNrPropertyCategories = getNrPropertyCategories;
const getNrPropertySubCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.query;
        const whereClause = { isActive: true };
        if (categoryId) {
            whereClause.propertyCategoryId = parseInt(categoryId);
        }
        const subCategories = yield prisma.nrPropertySubCategoryMaster.findMany({
            where: whereClause,
            select: {
                subCategoryId: true,
                subCategoryNumber: true,
                subCategoryName: true,
                propertyCategoryId: true,
            },
            orderBy: { subCategoryNumber: 'asc' },
        });
        res.json(subCategories);
    }
    catch (error) {
        console.error('Error fetching NR property sub-categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getNrPropertySubCategories = getNrPropertySubCategories;
const getConstructionNatures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const constructionNatures = yield prisma.constructionNatureMaster.findMany({
            where: { isActive: true },
            select: {
                constructionNatureId: true,
                constructionNatureName: true,
                description: true,
            },
            orderBy: { constructionNatureName: 'asc' },
        });
        res.json(constructionNatures);
    }
    catch (error) {
        console.error('Error fetching construction natures:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getConstructionNatures = getConstructionNatures;
const getOccupancyStatuses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const occupancyStatuses = yield prisma.occupancyStatusMaster.findMany({
            where: { isActive: true },
            select: {
                occupancyStatusId: true,
                occupancyStatusName: true,
                description: true,
            },
            orderBy: { occupancyStatusName: 'asc' },
        });
        res.json(occupancyStatuses);
    }
    catch (error) {
        console.error('Error fetching occupancy statuses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getOccupancyStatuses = getOccupancyStatuses;
const getSurveyTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const surveyTypes = yield prisma.surveyTypeMaster.findMany({
            where: { isActive: true },
            select: {
                surveyTypeId: true,
                surveyTypeName: true,
                description: true,
            },
            orderBy: { surveyTypeName: 'asc' },
        });
        res.json(surveyTypes);
    }
    catch (error) {
        console.error('Error fetching survey types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getSurveyTypes = getSurveyTypes;
const getAllMasterData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [responseTypes, propertyTypes, respondentStatuses, roadTypes, constructionTypes, waterSources, disposalTypes, floors, nrPropertyCategories, constructionNatures, occupancyStatuses, surveyTypes,] = yield Promise.all([
            prisma.responseTypeMaster.findMany({
                where: { isActive: true },
                select: { responseTypeId: true, responseTypeName: true },
                orderBy: { responseTypeName: 'asc' },
            }),
            prisma.propertyTypeMaster.findMany({
                where: { isActive: true },
                select: { propertyTypeId: true, propertyTypeName: true },
                orderBy: { propertyTypeName: 'asc' },
            }),
            prisma.respondentStatusMaster.findMany({
                where: { isActive: true },
                select: { respondentStatusId: true, respondentStatusName: true },
                orderBy: { respondentStatusName: 'asc' },
            }),
            prisma.roadTypeMaster.findMany({
                where: { isActive: true },
                select: { roadTypeId: true, roadTypeName: true },
                orderBy: { roadTypeName: 'asc' },
            }),
            prisma.constructionTypeMaster.findMany({
                where: { isActive: true },
                select: { constructionTypeId: true, constructionTypeName: true },
                orderBy: { constructionTypeName: 'asc' },
            }),
            prisma.waterSourceMaster.findMany({
                where: { isActive: true },
                select: { waterSourceId: true, waterSourceName: true },
                orderBy: { waterSourceName: 'asc' },
            }),
            prisma.disposalTypeMaster.findMany({
                where: { isActive: true },
                select: { disposalTypeId: true, disposalTypeName: true },
                orderBy: { disposalTypeName: 'asc' },
            }),
            prisma.floorMaster.findMany({
                where: { isActive: true },
                select: { floorNumberId: true, floorNumberName: true },
                orderBy: { floorNumberId: 'asc' },
            }),
            prisma.nrPropertyCategoryMaster.findMany({
                where: { isActive: true },
                select: { propertyCategoryId: true, propertyCategoryName: true },
                orderBy: { propertyCategoryNumber: 'asc' },
            }),
            prisma.constructionNatureMaster.findMany({
                where: { isActive: true },
                select: { constructionNatureId: true, constructionNatureName: true },
                orderBy: { constructionNatureName: 'asc' },
            }),
            prisma.occupancyStatusMaster.findMany({
                where: { isActive: true },
                select: { occupancyStatusId: true, occupancyStatusName: true },
                orderBy: { occupancyStatusName: 'asc' },
            }),
            prisma.surveyTypeMaster.findMany({
                where: { isActive: true },
                select: { surveyTypeId: true, surveyTypeName: true },
                orderBy: { surveyTypeName: 'asc' },
            }),
        ]);
        res.json({
            responseTypes,
            propertyTypes,
            respondentStatuses,
            roadTypes,
            constructionTypes,
            waterSources,
            disposalTypes,
            floors,
            nrPropertyCategories,
            constructionNatures,
            occupancyStatuses,
            surveyTypes,
        });
    }
    catch (error) {
        console.error('Error fetching all master data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllMasterData = getAllMasterData;
