"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getSupervisorsByWard = exports.getSurveyorsByWard = exports.getWardMohallaMappings = exports.getAvailableMohallas = exports.getAvailableWards = exports.removeSupervisorFromWard = exports.assignSupervisorToWard = exports.updateWardStatus = exports.getWardAssignments = exports.toggleSurveyorAccess = exports.updateWardAssignment = exports.bulkWardAssignment = exports.assignWardToSupervisor = exports.assignWardToSurveyor = void 0;
const wardService = __importStar(require("../services/wardService"));
const wardDto_1 = require("../dtos/wardDto");
// 1. Assign Ward to Surveyor
const assignWardToSurveyor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = wardDto_1.AssignWardToSurveyorSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const assignedById = req.user.userId;
        const result = yield wardService.assignWardToSurveyor(parsed.data, assignedById);
        return res.status(201).json(result);
    }
    catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.assignWardToSurveyor = assignWardToSurveyor;
// 2. Assign Ward to Supervisor
const assignWardToSupervisor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = wardDto_1.AssignWardToSupervisorSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const assignedById = req.user.userId;
        const result = yield wardService.assignWardToSupervisor(parsed.data, assignedById);
        return res.status(201).json(result);
    }
    catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.assignWardToSupervisor = assignWardToSupervisor;
// 3. Bulk Ward Assignment
const bulkWardAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = wardDto_1.BulkWardAssignmentSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const assignedById = req.user.userId;
        const result = yield wardService.bulkWardAssignment(parsed.data, assignedById);
        return res.status(201).json(result);
    }
    catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.bulkWardAssignment = bulkWardAssignment;
// 4. Update Ward Assignment Status
const updateWardAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = wardDto_1.UpdateWardAssignmentSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const updatedById = req.user.userId;
        const result = yield wardService.updateWardAssignment(parsed.data, updatedById);
        return res.status(200).json(result);
    }
    catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateWardAssignment = updateWardAssignment;
// 5. Toggle Surveyor Access
const toggleSurveyorAccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = wardDto_1.ToggleSurveyorAccessSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const actionById = req.user.userId;
        const result = yield wardService.toggleSurveyorAccess(parsed.data, actionById);
        return res.status(200).json(result);
    }
    catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.toggleSurveyorAccess = toggleSurveyorAccess;
// 6. Get Ward Assignments
const getWardAssignments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = wardDto_1.GetWardAssignmentsSchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid query parameters' });
        }
        const result = yield wardService.getWardAssignments(parsed.data);
        return res.status(200).json(result);
    }
    catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getWardAssignments = getWardAssignments;
// 7. Update Ward Status
const updateWardStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = wardDto_1.UpdateWardStatusSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const updatedById = req.user.userId;
        const result = yield wardService.updateWardStatus(parsed.data, updatedById);
        return res.status(200).json(result);
    }
    catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateWardStatus = updateWardStatus;
// 8. Assign Supervisor to Ward
const assignSupervisorToWard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = wardDto_1.AssignSupervisorToWardSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const assignedById = req.user.userId;
        const result = yield wardService.assignSupervisorToWard(parsed.data, assignedById);
        return res.status(201).json(result);
    }
    catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.assignSupervisorToWard = assignSupervisorToWard;
// 9. Remove Supervisor from Ward
const removeSupervisorFromWard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = wardDto_1.RemoveSupervisorFromWardSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const removedById = req.user.userId;
        const result = yield wardService.removeSupervisorFromWard(parsed.data, removedById);
        return res.status(200).json(result);
    }
    catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.removeSupervisorFromWard = removeSupervisorFromWard;
// 10. Get Available Wards (for dropdowns)
const getAvailableWards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const wards = yield prisma.wardMaster.findMany({
            where: { isActive: true },
            select: {
                wardId: true,
                wardNumber: true,
                wardName: true,
                description: true,
            },
            orderBy: { wardNumber: 'asc' },
        });
        return res.status(200).json({ wards });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAvailableWards = getAvailableWards;
// 11. Get Available Mohallas (for dropdowns)
const getAvailableMohallas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const mohallas = yield prisma.mohallaMaster.findMany({
            where: { isActive: true },
            select: {
                mohallaId: true,
                mohallaName: true,
                description: true,
            },
            orderBy: { mohallaName: 'asc' },
        });
        return res.status(200).json({ mohallas });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAvailableMohallas = getAvailableMohallas;
// 12. Get Ward-Mohalla Mappings
const getWardMohallaMappings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const mappings = yield prisma.wardMohallaMapping.findMany({
            where: { isActive: true },
            include: {
                ward: {
                    select: {
                        wardId: true,
                        wardNumber: true,
                        wardName: true,
                    },
                },
                mohalla: {
                    select: {
                        mohallaId: true,
                        mohallaName: true,
                    },
                },
            },
            orderBy: [
                { ward: { wardNumber: 'asc' } },
                { mohalla: { mohallaName: 'asc' } },
            ],
        });
        return res.status(200).json({ mappings });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getWardMohallaMappings = getWardMohallaMappings;
// 13. Get Surveyors by Ward
const getSurveyorsByWard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wardId } = req.params;
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const surveyors = yield prisma.surveyorAssignment.findMany({
            where: { wardId, isActive: true },
            include: {
                user: {
                    select: {
                        userId: true,
                        username: true,
                        mobileNumber: true,
                    },
                },
                surveyor: {
                    select: {
                        surveyorName: true,
                    },
                },
            },
        });
        return res.status(200).json({ surveyors });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getSurveyorsByWard = getSurveyorsByWard;
// 14. Get Supervisors by Ward
const getSupervisorsByWard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wardId } = req.params;
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const supervisors = yield prisma.supervisors.findMany({
            where: { wardId },
            include: {
                user: {
                    select: {
                        userId: true,
                        username: true,
                        mobileNumber: true,
                    },
                },
            },
        });
        return res.status(200).json({ supervisors });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getSupervisorsByWard = getSupervisorsByWard;
