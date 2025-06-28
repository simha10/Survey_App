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
exports.getSupervisorDashboard = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSupervisorDashboard = (supervisorId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Get all wards assigned to this supervisor
    const supervisor = yield prisma.supervisors.findUnique({
        where: { userId: supervisorId },
        include: { ward: true },
    });
    if (!supervisor || !supervisor.wardId) {
        return { wards: [] };
    }
    // Get all surveyors assigned to this ward
    const assignments = yield prisma.surveyorAssignment.findMany({
        where: { wardId: supervisor.wardId, isActive: true },
        include: {
            user: { select: { userId: true, username: true, name: true } },
            mohalla: { select: { mohallaId: true, mohallaName: true } },
        },
    });
    // For each mohalla, group surveyors and count surveys
    const mohallaMap = {};
    for (const assignment of assignments) {
        const mohallaId = assignment.mohallaId;
        if (!mohallaMap[mohallaId]) {
            mohallaMap[mohallaId] = {
                mohallaId,
                mohallaName: (_a = assignment.mohalla) === null || _a === void 0 ? void 0 : _a.mohallaName,
                surveyors: [],
                surveyCount: 0,
            };
        }
        mohallaMap[mohallaId].surveyors.push({
            userId: assignment.user.userId,
            username: assignment.user.username,
            name: assignment.user.name,
        });
        // Count surveys for this surveyor in this mohalla
        // (Assuming SurveyDetails has mohallaId and uploadedById)
        // You may want to optimize this with a single query if needed
        mohallaMap[mohallaId].surveyCount += yield prisma.surveyDetails.count({
            where: {
                mohallaId,
                uploadedById: assignment.user.userId,
            },
        });
    }
    return {
        wardId: supervisor.wardId,
        wardName: (_b = supervisor.ward) === null || _b === void 0 ? void 0 : _b.wardName,
        mohallas: Object.values(mohallaMap),
    };
});
exports.getSupervisorDashboard = getSupervisorDashboard;
