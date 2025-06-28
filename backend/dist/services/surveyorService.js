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
exports.assignWard = assignWard;
exports.toggleLogin = toggleLogin;
exports.getSurveyorAssignments = getSurveyorAssignments;
exports.removeWardAssignment = removeWardAssignment;
exports.getSurveyorProfile = getSurveyorProfile;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Helper function to validate user role
function validateUserRole(userId, expectedRole) {
    return __awaiter(this, void 0, void 0, function* () {
        const mapping = yield prisma.userRoleMapping.findFirst({
            where: { userId, isActive: true },
            include: { role: true },
        });
        if (!mapping || mapping.role.roleName !== expectedRole) {
            throw { status: 400, message: `Invalid ${expectedRole.toLowerCase()}` };
        }
        return mapping;
    });
}
// Helper function to validate ward entities
function validateWardEntities(wardId, mohallaId, wardMohallaMapId, zoneWardMapId, ulbZoneMapId) {
    return __awaiter(this, void 0, void 0, function* () {
        const [ward, mohalla, wardMohalla, zoneWard, ulbZone] = yield Promise.all([
            prisma.wardMaster.findUnique({ where: { wardId } }),
            prisma.mohallaMaster.findUnique({ where: { mohallaId } }),
            prisma.wardMohallaMapping.findUnique({ where: { wardMohallaMapId } }),
            prisma.zoneWardMapping.findUnique({ where: { zoneWardMapId } }),
            prisma.ulbZoneMapping.findUnique({ where: { ulbZoneMapId } }),
        ]);
        if (!ward || !mohalla || !wardMohalla || !zoneWard || !ulbZone) {
            throw { status: 400, message: 'Invalid ward/mohalla/zone/ulb mapping' };
        }
        return { ward, mohalla, wardMohalla, zoneWard, ulbZone };
    });
}
function assignWard(dto, assignedById) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, wardId, mohallaId, wardMohallaMapId, zoneWardMapId, ulbZoneMapId, assignmentType = 'PRIMARY' } = dto;
        try {
            // Validate user is a surveyor
            yield validateUserRole(userId, 'SURVEYOR');
            // Validate ward entities
            const { ward } = yield validateWardEntities(wardId, mohallaId, wardMohallaMapId, zoneWardMapId, ulbZoneMapId);
            // Check for existing assignment
            const existingAssignment = yield prisma.surveyorAssignment.findFirst({
                where: { userId, wardId, mohallaId, isActive: true },
            });
            if (existingAssignment) {
                throw { status: 409, message: 'Surveyor already assigned to this ward-mohalla combination' };
            }
            // Update Surveyors table and create assignment
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Update surveyor's ward information
                yield tx.surveyors.update({
                    where: { userId },
                    data: {
                        wardMohallaMapId,
                        zoneWardMapId,
                        ulbZoneMapId,
                    },
                });
                // Create assignment record
                const assignment = yield tx.surveyorAssignment.create({
                    data: {
                        userId,
                        assignmentType,
                        wardId,
                        mohallaId,
                        wardMohallaMapId,
                        assignedById,
                        isActive: true,
                    },
                });
                return assignment;
            }));
            return {
                assignmentId: result.assignmentId,
                userId,
                wardId,
                mohallaId,
                assignmentType,
                status: 'Ward assigned successfully',
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
function toggleLogin(dto) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, isActive } = dto;
        try {
            // Validate user is a surveyor
            yield validateUserRole(userId, 'SURVEYOR');
            // If disabling, check assignments and inactivity
            if (!isActive) {
                const assignments = yield prisma.surveyorAssignment.findMany({
                    where: { userId, isActive: true },
                });
                if (assignments.length === 0) {
                    yield prisma.usersMaster.update({
                        where: { userId },
                        data: { isActive: false }
                    });
                    return { userId, isActive: false, status: 'Surveyor deactivated - no active assignments' };
                }
                // Check inactivity (7+ days)
                const user = yield prisma.usersMaster.findUnique({ where: { userId } });
                if (user && user.isCreatedAt) {
                    const daysSinceCreation = (new Date().getTime() - new Date(user.isCreatedAt).getTime()) / (1000 * 60 * 60 * 24);
                    if (daysSinceCreation > 7) {
                        yield prisma.usersMaster.update({
                            where: { userId },
                            data: { isActive: false }
                        });
                        return { userId, isActive: false, status: 'Surveyor deactivated - inactive for 7+ days' };
                    }
                }
            }
            // Update user status
            yield prisma.usersMaster.update({
                where: { userId },
                data: { isActive }
            });
            return {
                userId,
                isActive,
                status: isActive ? 'Surveyor activated' : 'Surveyor deactivated'
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
// Additional surveyor management functions
function getSurveyorAssignments(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validate user is a surveyor
            yield validateUserRole(userId, 'SURVEYOR');
            const assignments = yield prisma.surveyorAssignment.findMany({
                where: { userId, isActive: true },
                include: {
                    ward: true,
                    mohalla: true,
                    assignedBy: {
                        include: {
                            userRoleMaps: {
                                where: { isActive: true },
                                include: { role: true },
                            },
                        },
                    },
                },
                orderBy: { assignmentId: 'desc' },
            });
            return {
                userId,
                assignments,
                total: assignments.length,
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
function removeWardAssignment(assignmentId, removedById) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const assignment = yield prisma.surveyorAssignment.findUnique({
                where: { assignmentId },
                include: { user: true },
            });
            if (!assignment) {
                throw { status: 404, message: 'Assignment not found' };
            }
            // Validate user is a surveyor
            yield validateUserRole(assignment.userId, 'SURVEYOR');
            const result = yield prisma.surveyorAssignment.update({
                where: { assignmentId },
                data: { isActive: false },
            });
            return {
                assignmentId,
                userId: assignment.userId,
                wardId: assignment.wardId,
                status: 'Ward assignment removed successfully',
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
function getSurveyorProfile(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            // Validate user is a surveyor
            yield validateUserRole(userId, 'SURVEYOR');
            const surveyor = yield prisma.surveyors.findUnique({
                where: { userId },
                include: {
                    user: {
                        include: {
                            userRoleMaps: {
                                where: { isActive: true },
                                include: { role: true },
                            },
                        },
                    },
                    wardMohallaMap: {
                        include: {
                            ward: true,
                            mohalla: true,
                        },
                    },
                    zoneWardMap: {
                        include: {
                            zone: true,
                            ward: true,
                        },
                    },
                    ulbZoneMap: {
                        include: {
                            ulb: true,
                            zone: true,
                        },
                    },
                },
            });
            if (!surveyor) {
                throw { status: 404, message: 'Surveyor not found' };
            }
            return {
                userId: surveyor.userId,
                surveyorName: surveyor.surveyorName,
                username: surveyor.username,
                isActive: surveyor.user.isActive,
                ward: ((_a = surveyor.wardMohallaMap) === null || _a === void 0 ? void 0 : _a.ward) || null,
                mohalla: ((_b = surveyor.wardMohallaMap) === null || _b === void 0 ? void 0 : _b.mohalla) || null,
                zone: ((_c = surveyor.zoneWardMap) === null || _c === void 0 ? void 0 : _c.zone) || null,
                ulb: ((_d = surveyor.ulbZoneMap) === null || _d === void 0 ? void 0 : _d.ulb) || null,
                role: ((_e = surveyor.user.userRoleMaps[0]) === null || _e === void 0 ? void 0 : _e.role.roleName) || null,
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
