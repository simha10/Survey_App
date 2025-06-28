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
exports.assignWardToSurveyor = assignWardToSurveyor;
exports.assignWardToSupervisor = assignWardToSupervisor;
exports.bulkWardAssignment = bulkWardAssignment;
exports.updateWardAssignment = updateWardAssignment;
exports.toggleSurveyorAccess = toggleSurveyorAccess;
exports.getWardAssignments = getWardAssignments;
exports.updateWardStatus = updateWardStatus;
exports.assignSupervisorToWard = assignSupervisorToWard;
exports.removeSupervisorFromWard = removeSupervisorFromWard;
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
// Helper function to validate ward and related entities
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
// 1. Assign Ward to Surveyor
function assignWardToSurveyor(dto, assignedById) {
    return __awaiter(this, void 0, void 0, function* () {
        const { surveyorId, wardId, mohallaId, wardMohallaMapId, zoneWardMapId, ulbZoneMapId, assignmentType, supervisorId } = dto;
        try {
            // Validate surveyor
            yield validateUserRole(surveyorId, 'SURVEYOR');
            // Validate ward entities
            const { ward } = yield validateWardEntities(wardId, mohallaId, wardMohallaMapId, zoneWardMapId, ulbZoneMapId);
            // Validate supervisor if provided
            if (supervisorId) {
                yield validateUserRole(supervisorId, 'SUPERVISOR');
            }
            // Check for existing assignment
            const existingAssignment = yield prisma.surveyorAssignment.findFirst({
                where: { userId: surveyorId, wardId, mohallaId, isActive: true },
            });
            if (existingAssignment) {
                throw { status: 409, message: 'Surveyor already assigned to this ward-mohalla combination' };
            }
            // Create assignment
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Update surveyor's ward information
                yield tx.surveyors.update({
                    where: { userId: surveyorId },
                    data: {
                        wardMohallaMapId,
                        zoneWardMapId,
                        ulbZoneMapId,
                    },
                });
                // Create assignment record
                const assignment = yield tx.surveyorAssignment.create({
                    data: {
                        userId: surveyorId,
                        assignmentType,
                        wardId,
                        mohallaId,
                        wardMohallaMapId,
                        assignedById,
                        isActive: true,
                    },
                });
                // If supervisor is provided, ensure supervisor is assigned to this ward
                if (supervisorId) {
                    const supervisorAssignment = yield tx.supervisors.findFirst({
                        where: { userId: supervisorId, wardId },
                    });
                    if (!supervisorAssignment) {
                        yield tx.supervisors.update({
                            where: { userId: supervisorId },
                            data: { wardId },
                        });
                    }
                }
                if (surveyorId) {
                    yield prisma.auditLog.create({
                        data: {
                            userId: surveyorId,
                            action: 'ASSIGN_WARD_TO_SURVEYOR',
                            old_value: existingAssignment ? JSON.stringify(existingAssignment) : null,
                            new_value: JSON.stringify(assignment),
                        }
                    });
                }
                return assignment;
            }));
            return {
                assignmentId: result.assignmentId,
                surveyorId,
                wardId,
                mohallaId,
                assignmentType,
                supervisorId,
                status: 'Assigned successfully',
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
// 2. Assign Ward to Supervisor
function assignWardToSupervisor(dto, assignedById) {
    return __awaiter(this, void 0, void 0, function* () {
        const { supervisorId, wardIds, isActive } = dto;
        try {
            // Validate supervisor
            yield validateUserRole(supervisorId, 'SUPERVISOR');
            // Validate all wards exist
            const wards = yield prisma.wardMaster.findMany({
                where: { wardId: { in: wardIds } },
            });
            if (wards.length !== wardIds.length) {
                throw { status: 400, message: 'One or more wards not found' };
            }
            // Assign wards to supervisor
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const assignments = [];
                for (const wardId of wardIds) {
                    // Check if supervisor is already assigned to this ward
                    const existing = yield tx.supervisors.findFirst({
                        where: { userId: supervisorId, wardId },
                    });
                    if (!existing) {
                        yield tx.supervisors.update({
                            where: { userId: supervisorId },
                            data: { wardId },
                        });
                    }
                    assignments.push({ supervisorId, wardId, isActive });
                }
                if (supervisorId) {
                    yield prisma.auditLog.create({
                        data: {
                            userId: supervisorId,
                            action: 'ASSIGN_WARD_TO_SUPERVISOR',
                            old_value: null,
                            new_value: JSON.stringify(assignments),
                        }
                    });
                }
                return assignments;
            }));
            return {
                supervisorId,
                assignedWards: result,
                status: 'Supervisor assigned to wards successfully',
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
// 3. Bulk Ward Assignment
function bulkWardAssignment(dto, assignedById) {
    return __awaiter(this, void 0, void 0, function* () {
        const { surveyorId, assignments, supervisorId } = dto;
        try {
            // Validate surveyor
            yield validateUserRole(surveyorId, 'SURVEYOR');
            // Validate supervisor if provided
            if (supervisorId) {
                yield validateUserRole(supervisorId, 'SUPERVISOR');
            }
            // Validate all ward entities
            for (const assignment of assignments) {
                yield validateWardEntities(assignment.wardId, assignment.mohallaId, assignment.wardMohallaMapId, assignment.zoneWardMapId, assignment.ulbZoneMapId);
            }
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const createdAssignments = [];
                for (const assignment of assignments) {
                    // Check for existing assignment
                    const existing = yield tx.surveyorAssignment.findFirst({
                        where: { userId: surveyorId, wardId: assignment.wardId, mohallaId: assignment.mohallaId, isActive: true },
                    });
                    if (!existing) {
                        const newAssignment = yield tx.surveyorAssignment.create({
                            data: {
                                userId: surveyorId,
                                assignmentType: assignment.assignmentType,
                                wardId: assignment.wardId,
                                mohallaId: assignment.mohallaId,
                                wardMohallaMapId: assignment.wardMohallaMapId,
                                assignedById,
                                isActive: true,
                            },
                        });
                        createdAssignments.push(newAssignment);
                    }
                }
                // Update surveyor's primary ward info (use first assignment)
                if (assignments.length > 0) {
                    const firstAssignment = assignments[0];
                    yield tx.surveyors.update({
                        where: { userId: surveyorId },
                        data: {
                            wardMohallaMapId: firstAssignment.wardMohallaMapId,
                            zoneWardMapId: firstAssignment.zoneWardMapId,
                            ulbZoneMapId: firstAssignment.ulbZoneMapId,
                        },
                    });
                }
                if (surveyorId) {
                    yield prisma.auditLog.create({
                        data: {
                            userId: surveyorId,
                            action: 'BULK_WARD_ASSIGNMENT',
                            old_value: null,
                            new_value: JSON.stringify(createdAssignments),
                        }
                    });
                }
                return createdAssignments;
            }));
            return {
                surveyorId,
                assignedWards: result.length,
                assignments: result,
                status: 'Bulk assignment completed successfully',
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
// 4. Update Ward Assignment Status
function updateWardAssignment(dto, updatedById) {
    return __awaiter(this, void 0, void 0, function* () {
        const { assignmentId, isActive, reason } = dto;
        try {
            const assignment = yield prisma.surveyorAssignment.findUnique({
                where: { assignmentId },
                include: { user: true, ward: true },
            });
            if (!assignment) {
                throw { status: 404, message: 'Assignment not found' };
            }
            const result = yield prisma.surveyorAssignment.update({
                where: { assignmentId },
                data: { isActive },
            });
            if (updatedById) {
                yield prisma.auditLog.create({
                    data: {
                        userId: updatedById,
                        action: 'UPDATE_WARD_ASSIGNMENT',
                        old_value: JSON.stringify(assignment),
                        new_value: JSON.stringify(result),
                    }
                });
            }
            return {
                assignmentId,
                surveyorId: assignment.userId,
                wardId: assignment.wardId,
                isActive,
                reason,
                status: 'Assignment updated successfully',
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
// 5. Toggle Surveyor Access (Supervisor/Admin/SuperAdmin can control)
function toggleSurveyorAccess(dto, actionById) {
    return __awaiter(this, void 0, void 0, function* () {
        const { surveyorId, wardId, isActive, reason, actionBy } = dto;
        try {
            // Validate surveyor
            yield validateUserRole(surveyorId, 'SURVEYOR');
            // Validate action performer has appropriate role
            const actionPerformer = yield prisma.userRoleMapping.findFirst({
                where: { userId: actionById, isActive: true },
                include: { role: true },
            });
            if (!actionPerformer) {
                throw { status: 401, message: 'Unauthorized action' };
            }
            // Check if action performer has permission
            const allowedRoles = ['SUPERADMIN', 'ADMIN'];
            if (actionBy === 'SUPERVISOR') {
                allowedRoles.push('SUPERVISOR');
            }
            if (!allowedRoles.includes(actionPerformer.role.roleName)) {
                throw { status: 403, message: 'Insufficient permissions' };
            }
            // If supervisor is performing action, validate they supervise the ward
            if (actionPerformer.role.roleName === 'SUPERVISOR' && wardId) {
                const supervisorWard = yield prisma.supervisors.findFirst({
                    where: { userId: actionById, wardId },
                });
                if (!supervisorWard) {
                    throw { status: 403, message: 'Supervisor does not have authority over this ward' };
                }
            }
            // Update assignments
            const whereClause = { userId: surveyorId };
            if (wardId) {
                whereClause.wardId = wardId;
            }
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Update surveyor assignments
                yield tx.surveyorAssignment.updateMany({
                    where: whereClause,
                    data: { isActive },
                });
                // If disabling all access, also update user status
                if (!isActive && !wardId) {
                    yield tx.usersMaster.update({
                        where: { userId: surveyorId },
                        data: { isActive: false },
                    });
                }
                if (actionById) {
                    yield prisma.auditLog.create({
                        data: {
                            userId: actionById,
                            action: 'TOGGLE_SURVEYOR_ACCESS',
                            old_value: JSON.stringify({ surveyorId, wardId, isActive }),
                            new_value: JSON.stringify({ surveyorId, wardId, isActive }),
                        }
                    });
                }
                return { surveyorId, wardId, isActive, actionBy, reason };
            }));
            return Object.assign(Object.assign({}, result), { status: `Surveyor access ${isActive ? 'enabled' : 'disabled'} successfully` });
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
// 6. Get Ward Assignments
function getWardAssignments(dto) {
    return __awaiter(this, void 0, void 0, function* () {
        const { wardId, surveyorId, supervisorId, isActive } = dto;
        try {
            const whereClause = {};
            if (wardId)
                whereClause.wardId = wardId;
            if (surveyorId)
                whereClause.userId = surveyorId;
            if (isActive !== undefined)
                whereClause.isActive = isActive;
            const assignments = yield prisma.surveyorAssignment.findMany({
                where: whereClause,
                include: {
                    user: {
                        include: {
                            userRoleMaps: {
                                where: { isActive: true },
                                include: { role: true },
                            },
                        },
                    },
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
            });
            // Filter by supervisor if provided
            let filteredAssignments = assignments;
            if (supervisorId) {
                const supervisorWards = yield prisma.supervisors.findMany({
                    where: { userId: supervisorId },
                    select: { wardId: true },
                });
                const supervisorWardIds = supervisorWards.map(sw => sw.wardId);
                filteredAssignments = assignments.filter(a => supervisorWardIds.includes(a.wardId));
            }
            if (surveyorId) {
                yield prisma.auditLog.create({
                    data: {
                        userId: surveyorId,
                        action: 'GET_WARD_ASSIGNMENTS',
                        old_value: null,
                        new_value: JSON.stringify({ assignments: filteredAssignments, total: filteredAssignments.length }),
                    }
                });
            }
            return {
                assignments: filteredAssignments,
                total: filteredAssignments.length,
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
// 7. Update Ward Status
function updateWardStatus(dto, updatedById) {
    return __awaiter(this, void 0, void 0, function* () {
        const { wardId, statusId, reason } = dto;
        try {
            // Validate ward and status exist
            const [ward, status] = yield Promise.all([
                prisma.wardMaster.findUnique({ where: { wardId } }),
                prisma.wardStatusMaster.findUnique({ where: { statusId } }),
            ]);
            if (!ward || !status) {
                throw { status: 400, message: 'Invalid ward or status' };
            }
            const result = yield prisma.wardStatusMapping.upsert({
                where: { wardId_statusId: { wardId, statusId } },
                update: { isActive: true, changedById: updatedById },
                create: {
                    wardId,
                    statusId,
                    changedById: updatedById,
                    isActive: true,
                },
            });
            if (updatedById) {
                yield prisma.auditLog.create({
                    data: {
                        userId: updatedById,
                        action: 'UPDATE_WARD_STATUS',
                        old_value: JSON.stringify({ wardId, statusId, statusName: status.statusName }),
                        new_value: JSON.stringify({ wardId, statusId, statusName: status.statusName }),
                    }
                });
            }
            return {
                wardId,
                statusId,
                statusName: status.statusName,
                reason,
                status: 'Ward status updated successfully',
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
// 8. Assign Supervisor to Ward
function assignSupervisorToWard(dto, assignedById) {
    return __awaiter(this, void 0, void 0, function* () {
        const { supervisorId, wardId, isActive } = dto;
        try {
            // Validate supervisor
            yield validateUserRole(supervisorId, 'SUPERVISOR');
            // Validate ward
            const ward = yield prisma.wardMaster.findUnique({ where: { wardId } });
            if (!ward) {
                throw { status: 400, message: 'Invalid ward' };
            }
            const result = yield prisma.supervisors.update({
                where: { userId: supervisorId },
                data: { wardId },
            });
            if (supervisorId) {
                yield prisma.auditLog.create({
                    data: {
                        userId: supervisorId,
                        action: 'ASSIGN_SUPERVISOR_TO_WARD',
                        old_value: null,
                        new_value: JSON.stringify({ supervisorId, wardId, isActive }),
                    }
                });
            }
            return {
                supervisorId,
                wardId,
                isActive,
                status: 'Supervisor assigned to ward successfully',
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
// 9. Remove Supervisor from Ward
function removeSupervisorFromWard(dto, removedById) {
    return __awaiter(this, void 0, void 0, function* () {
        const { supervisorId, wardId, reason } = dto;
        try {
            // Validate supervisor
            yield validateUserRole(supervisorId, 'SUPERVISOR');
            const supervisor = yield prisma.supervisors.findFirst({
                where: { userId: supervisorId, wardId },
            });
            if (!supervisor) {
                throw { status: 404, message: 'Supervisor not assigned to this ward' };
            }
            // Check if supervisor has active surveyors in this ward
            const activeSurveyors = yield prisma.surveyorAssignment.findMany({
                where: { wardId, isActive: true },
                include: {
                    user: {
                        include: {
                            userRoleMaps: {
                                where: { isActive: true },
                                include: { role: true },
                            },
                        },
                    },
                },
            });
            if (activeSurveyors.length > 0) {
                throw { status: 400, message: 'Cannot remove supervisor: active surveyors assigned to this ward' };
            }
            yield prisma.supervisors.update({
                where: { userId: supervisorId },
                data: { wardId: null },
            });
            if (removedById) {
                yield prisma.auditLog.create({
                    data: {
                        userId: removedById,
                        action: 'REMOVE_SUPERVISOR_FROM_WARD',
                        old_value: JSON.stringify({ supervisorId, wardId }),
                        new_value: JSON.stringify({ supervisorId, wardId }),
                    }
                });
            }
            return {
                supervisorId,
                wardId,
                reason,
                status: 'Supervisor removed from ward successfully',
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
