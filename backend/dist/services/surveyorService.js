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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function assignWard(dto, assignedById) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, wardId, mohallaId, wardMohallaMapId, zoneWardMapId, ulbZoneMapId } = dto;
        try {
            // Validate user is a surveyor
            const mapping = yield prisma.userRoleMapping.findFirst({
                where: { userId, isActive: true },
                include: { role: true },
            });
            if (!mapping || mapping.role.roleName !== 'SURVEYOR') {
                throw { status: 400, message: 'Invalid surveyor' };
            }
            // Validate all IDs exist
            const ward = yield prisma.wardMaster.findUnique({ where: { wardId } });
            const mohalla = yield prisma.mohallaMaster.findUnique({ where: { mohallaId } });
            const wardMohalla = yield prisma.wardMohallaMapping.findUnique({ where: { wardMohallaMapId } });
            const zoneWard = yield prisma.zoneWardMapping.findUnique({ where: { zoneWardMapId } });
            const ulbZone = yield prisma.ulbZoneMapping.findUnique({ where: { ulbZoneMapId } });
            if (!ward || !mohalla || !wardMohalla || !zoneWard || !ulbZone) {
                throw { status: 400, message: 'Invalid ward/mohalla/zone/ulb' };
            }
            // Check for existing assignment
            const existingAssignment = yield prisma.surveyorAssignment.findFirst({
                where: { userId, wardId, mohallaId, isActive: true },
            });
            if (existingAssignment) {
                throw { status: 409, message: 'Surveyor already assigned to ward' };
            }
            // Update Surveyors table and create assignment
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield tx.surveyors.update({
                    where: { userId },
                    data: {
                        wardNumber: ward.wardNumber,
                        wardMohallaMapId,
                        zoneWardMapId,
                        ulbZoneMapId,
                    },
                });
                yield tx.surveyorAssignment.create({
                    data: {
                        userId,
                        assignmentType: 'PRIMARY',
                        wardId,
                        mohallaId,
                        wardMohallaMapId,
                        assignedById,
                        isActive: true,
                    },
                });
                return { userId, wardId, mohallaId, status: 'Assigned' };
            }));
            return result;
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
            const mapping = yield prisma.userRoleMapping.findFirst({
                where: { userId, isActive: true },
                include: { role: true },
            });
            if (!mapping || mapping.role.roleName !== 'SURVEYOR') {
                throw { status: 400, message: 'Invalid surveyor' };
            }
            // If disabling, check assignments and inactivity
            if (!isActive) {
                const assignments = yield prisma.surveyorAssignment.findMany({
                    where: { userId, isActive: true },
                });
                if (assignments.length === 0) {
                    yield prisma.usersMaster.update({ where: { userId }, data: { isActive: false } });
                    return { userId, isActive: false, status: 'Updated' };
                }
                // Check inactivity (7+ days)
                const user = yield prisma.usersMaster.findUnique({ where: { userId } });
                if (user && user.isCreatedAt && (new Date().getTime() - new Date(user.isCreatedAt).getTime()) > 7 * 24 * 60 * 60 * 1000) {
                    yield prisma.usersMaster.update({ where: { userId }, data: { isActive: false } });
                    return { userId, isActive: false, status: 'Updated' };
                }
            }
            // Otherwise, just update isActive
            yield prisma.usersMaster.update({ where: { userId }, data: { isActive } });
            return { userId, isActive, status: 'Updated' };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
