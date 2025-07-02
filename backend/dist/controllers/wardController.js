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
exports.getWardsByZoneWithStatus = exports.getAllWardsWithStatus = exports.searchWards = exports.updateWardStatus = exports.getAllWardStatuses = exports.getWardsByZone = exports.deleteWard = exports.updateWard = exports.createWard = exports.getWardById = exports.getWardStatuses = exports.getAllWards = exports.getSupervisorsByWard = exports.getSurveyorsByWard = exports.getWardMohallaMappings = exports.getAvailableMohallas = exports.getAvailableWards = exports.removeSupervisorFromWard = exports.assignSupervisorToWard = exports.getWardAssignments = exports.toggleSurveyorAccess = exports.updateWardAssignment = exports.bulkWardAssignment = exports.assignWardToSupervisor = exports.assignWardToSurveyor = void 0;
const wardService = __importStar(require("../services/wardService"));
const wardDto_1 = require("../dtos/wardDto");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
// 7. Update Ward Status (DEPRECATED, use updateWardAndMohallasStatus)
// export const updateWardStatus = ... (leave as is, but add a comment to not use)
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
        const wards = yield prisma.wardMaster.findMany({
            where: { isActive: true },
            select: {
                wardId: true,
                newWardNumber: true,
                wardName: true,
                description: true,
            },
            orderBy: { newWardNumber: 'asc' },
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
        const mappings = yield prisma.wardMohallaMapping.findMany({
            where: { isActive: true },
            include: {
                ward: {
                    select: {
                        wardId: true,
                        newWardNumber: true,
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
                { ward: { newWardNumber: 'asc' } },
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
const getAllWards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wards = yield prisma.wardMaster.findMany({
            where: { isActive: true },
            select: {
                wardId: true,
                newWardNumber: true,
                wardName: true,
                isActive: true,
                description: true,
            },
            orderBy: { newWardNumber: 'asc' },
        });
        res.json(wards);
    }
    catch (error) {
        console.error('Error fetching wards:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllWards = getAllWards;
// Get all possible ward statuses
const getWardStatuses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statuses = yield prisma.wardStatusMaster.findMany({
            where: { isActive: true },
            select: {
                wardStatusId: true,
                statusName: true,
                isActive: true,
                description: true,
            },
            orderBy: { statusName: 'asc' },
        });
        res.json(statuses);
    }
    catch (error) {
        console.error('Error fetching ward statuses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getWardStatuses = getWardStatuses;
const getWardById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wardId } = req.params;
        const ward = yield prisma.wardMaster.findUnique({
            where: { wardId },
            select: {
                wardId: true,
                newWardNumber: true,
                wardName: true,
                isActive: true,
                description: true,
            },
        });
        if (!ward) {
            return res.status(404).json({ message: 'Ward not found' });
        }
        res.json(ward);
    }
    catch (error) {
        console.error('Error fetching ward:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getWardById = getWardById;
const createWard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newWardNumber, wardName, description } = req.body;
        if (!newWardNumber || !wardName) {
            return res.status(400).json({ message: 'Ward number and name are required' });
        }
        const ward = yield prisma.wardMaster.create({
            data: {
                newWardNumber,
                wardName,
                description,
                isActive: true,
            },
            select: {
                wardId: true,
                newWardNumber: true,
                wardName: true,
                isActive: true,
                description: true,
            },
        });
        res.status(201).json(ward);
    }
    catch (error) {
        console.error('Error creating ward:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createWard = createWard;
const updateWard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wardId } = req.params;
        const { newWardNumber, wardName, description, isActive } = req.body;
        const ward = yield prisma.wardMaster.update({
            where: { wardId },
            data: {
                newWardNumber,
                wardName,
                description,
                isActive,
            },
            select: {
                wardId: true,
                newWardNumber: true,
                wardName: true,
                isActive: true,
                description: true,
            },
        });
        res.json(ward);
    }
    catch (error) {
        console.error('Error updating ward:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateWard = updateWard;
const deleteWard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wardId } = req.params;
        yield prisma.wardMaster.update({
            where: { wardId },
            data: { isActive: false },
        });
        res.json({ message: 'Ward deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting ward:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteWard = deleteWard;
const getWardsByZone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { zoneId } = req.params;
        const mappings = yield prisma.zoneWardMapping.findMany({
            where: { zoneId, isActive: true },
            include: {
                ward: {
                    select: {
                        wardId: true,
                        newWardNumber: true,
                        wardName: true,
                        isActive: true,
                        description: true,
                        wardStatusMaps: {
                            where: { isActive: true },
                            include: {
                                status: {
                                    select: {
                                        wardStatusId: true,
                                        statusName: true,
                                        description: true
                                    }
                                }
                            }
                        }
                    },
                },
            },
            orderBy: {
                ward: { newWardNumber: 'asc' },
            },
        });
        const wards = mappings.map(m => m.ward);
        res.json(wards);
    }
    catch (error) {
        console.error('Error fetching wards by zone:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getWardsByZone = getWardsByZone;
const getAllWardStatuses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statuses = yield prisma.wardStatusMaster.findMany({
            where: { isActive: true },
            select: {
                wardStatusId: true,
                statusName: true,
                isActive: true,
                description: true,
            },
            orderBy: { statusName: 'asc' },
        });
        res.json(statuses);
    }
    catch (error) {
        console.error('Error fetching ward statuses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllWardStatuses = getAllWardStatuses;
// Update status for a ward (mohallas inherit status from ward)
const updateWardStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let wardId = '';
    let wardStatusId = 0;
    let userId = '';
    try {
        wardId = req.params.wardId;
        wardStatusId = req.body.wardStatusId;
        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!wardId || !wardStatusId || !userId) {
            return res.status(400).json({ error: 'wardId, wardStatusId, and userId are required' });
        }
        // Validate existence
        const ward = yield prisma.wardMaster.findUnique({ where: { wardId } });
        if (!ward)
            return res.status(404).json({ error: 'Ward not found' });
        const status = yield prisma.wardStatusMaster.findUnique({ where: { wardStatusId } });
        if (!status)
            return res.status(404).json({ error: 'Status not found' });
        // Check if a mapping already exists for this ward-status combination
        const existingMapping = yield prisma.wardStatusMapping.findFirst({
            where: {
                wardId,
                wardStatusId
            }
        });
        // Deactivate all previous status mappings for this ward
        yield prisma.wardStatusMapping.updateMany({
            where: { wardId },
            data: { isActive: false }
        });
        if (existingMapping) {
            // Update existing mapping to active
            yield prisma.wardStatusMapping.update({
                where: { mappingId: existingMapping.mappingId },
                data: {
                    isActive: true,
                    changedById: userId
                }
            });
        }
        else {
            // Create new status mapping for the ward
            yield prisma.wardStatusMapping.create({
                data: {
                    wardId,
                    wardStatusId,
                    changedById: userId,
                    isActive: true,
                },
            });
        }
        // Update WardMaster.isActive based on status (assume 'Started' means active)
        if (status.statusName === 'Started') {
            yield prisma.wardMaster.update({ where: { wardId }, data: { isActive: true } });
        }
        else {
            yield prisma.wardMaster.update({ where: { wardId }, data: { isActive: false } });
        }
        // Audit log
        yield prisma.auditLog.create({
            data: {
                userId,
                action: 'WARD_STATUS_UPDATE',
                old_value: null, // Optionally fetch previous status
                new_value: `wardId:${wardId},wardStatusId:${wardStatusId}`,
            },
        });
        res.json({
            message: 'Ward status updated successfully. Mohallas will inherit this status.',
            wardId,
            newStatus: status.statusName
        });
    }
    catch (error) {
        console.error('Error updating ward status:', error);
        console.error('Error details:', {
            wardId: wardId,
            wardStatusId: wardStatusId,
            userId: userId,
            errorMessage: error === null || error === void 0 ? void 0 : error.message,
            errorCode: error === null || error === void 0 ? void 0 : error.code,
            errorMeta: error === null || error === void 0 ? void 0 : error.meta
        });
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateWardStatus = updateWardStatus;
// Search wards by name
const searchWards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        if (!search || typeof search !== 'string') {
            return res.status(400).json({ error: 'Search parameter is required' });
        }
        const wards = yield prisma.wardMaster.findMany({
            where: {
                isActive: true,
                wardName: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
            select: {
                wardId: true,
                newWardNumber: true,
                wardName: true,
                isActive: true,
                description: true,
                wardStatusMaps: {
                    where: { isActive: true },
                    include: {
                        status: {
                            select: {
                                wardStatusId: true,
                                statusName: true,
                                description: true
                            }
                        }
                    }
                }
            },
            orderBy: { newWardNumber: 'asc' },
        });
        res.json(wards);
    }
    catch (error) {
        console.error('Error searching wards:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.searchWards = searchWards;
// Get wards with status information
const getAllWardsWithStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wards = yield prisma.wardMaster.findMany({
            where: { isActive: true },
            select: {
                wardId: true,
                newWardNumber: true,
                wardName: true,
                isActive: true,
                description: true,
                wardStatusMaps: {
                    where: { isActive: true },
                    include: {
                        status: {
                            select: {
                                wardStatusId: true,
                                statusName: true,
                                description: true
                            }
                        }
                    }
                }
            },
            orderBy: { newWardNumber: 'asc' },
        });
        res.json(wards);
    }
    catch (error) {
        console.error('Error fetching wards with status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllWardsWithStatus = getAllWardsWithStatus;
// Get wards by zone with status filtering
const getWardsByZoneWithStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { zoneId } = req.params;
        const { status } = req.query;
        const mappings = yield prisma.zoneWardMapping.findMany({
            where: { zoneId, isActive: true },
            include: {
                ward: {
                    select: {
                        wardId: true,
                        newWardNumber: true,
                        wardName: true,
                        isActive: true,
                        description: true,
                        wardStatusMaps: {
                            where: { isActive: true },
                            include: {
                                status: {
                                    select: {
                                        wardStatusId: true,
                                        statusName: true,
                                        description: true
                                    }
                                }
                            }
                        }
                    },
                },
            },
            orderBy: {
                ward: { newWardNumber: 'asc' },
            },
        });
        let wards = mappings.map(m => m.ward);
        // Filter by status if provided
        if (status && typeof status === 'string') {
            wards = wards.filter((ward) => ward.wardStatusMaps &&
                ward.wardStatusMaps.length > 0 &&
                ward.wardStatusMaps[0].status.statusName === status);
        }
        res.json(wards);
    }
    catch (error) {
        console.error('Error fetching wards by zone with status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getWardsByZoneWithStatus = getWardsByZoneWithStatus;
