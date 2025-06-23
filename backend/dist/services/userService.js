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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = updateProfile;
exports.changePassword = changePassword;
exports.getUsers = getUsers;
exports.updateUserStatus = updateUserStatus;
exports.deleteUser = deleteUser;
exports.assignRole = assignRole;
exports.removeRole = removeRole;
exports.getUserStats = getUserStats;
exports.searchUsers = searchUsers;
exports.getUserProfile = getUserProfile;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
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
// 1. Update User Profile
function updateProfile(dto, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, mobileNumber } = dto;
        try {
            const user = yield prisma.usersMaster.findUnique({
                where: { userId },
                include: {
                    userRoleMaps: {
                        where: { isActive: true },
                        include: { role: true },
                    },
                },
            });
            if (!user) {
                throw { status: 404, message: 'User not found' };
            }
            const updateData = {};
            if (mobileNumber)
                updateData.mobileNumber = mobileNumber;
            if (name)
                updateData.name = name;
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                // Update UsersMaster
                const updatedUser = yield tx.usersMaster.update({
                    where: { userId },
                    data: updateData,
                });
                // Update role-specific table
                const userRole = (_a = user.userRoleMaps[0]) === null || _a === void 0 ? void 0 : _a.role.roleName;
                if (userRole === 'SURVEYOR' && name) {
                    yield tx.surveyors.update({
                        where: { userId },
                        data: { surveyorName: name },
                    });
                }
                else if (userRole === 'SUPERVISOR' && name) {
                    yield tx.supervisors.update({
                        where: { userId },
                        data: { supervisorName: name },
                    });
                }
                else if ((userRole === 'ADMIN' || userRole === 'SUPERADMIN') && name) {
                    yield tx.admins.update({
                        where: { userId },
                        data: { adminName: name },
                    });
                }
                return updatedUser;
            }));
            return {
                userId: result.userId,
                username: result.username,
                name: result.name,
                mobileNumber: result.mobileNumber,
                status: 'Profile updated successfully',
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
// 2. Change Password
function changePassword(dto, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { currentPassword, newPassword } = dto;
        try {
            const user = yield prisma.usersMaster.findUnique({
                where: { userId },
            });
            if (!user) {
                throw { status: 404, message: 'User not found' };
            }
            // Verify current password
            const isValidPassword = yield bcrypt_1.default.compare(currentPassword, user.password);
            if (!isValidPassword) {
                throw { status: 400, message: 'Current password is incorrect' };
            }
            // Hash new password
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Update UsersMaster
                yield tx.usersMaster.update({
                    where: { userId },
                    data: { password: hashedPassword },
                });
                // Update role-specific table
                const userRole = yield tx.userRoleMapping.findFirst({
                    where: { userId, isActive: true },
                    include: { role: true },
                });
                if ((userRole === null || userRole === void 0 ? void 0 : userRole.role.roleName) === 'SURVEYOR') {
                    yield tx.surveyors.update({
                        where: { userId },
                        data: { password: hashedPassword },
                    });
                }
                else if ((userRole === null || userRole === void 0 ? void 0 : userRole.role.roleName) === 'SUPERVISOR') {
                    yield tx.supervisors.update({
                        where: { userId },
                        data: { password: hashedPassword },
                    });
                }
                else if ((userRole === null || userRole === void 0 ? void 0 : userRole.role.roleName) === 'ADMIN' || (userRole === null || userRole === void 0 ? void 0 : userRole.role.roleName) === 'SUPERADMIN') {
                    yield tx.admins.update({
                        where: { userId },
                        data: { password: hashedPassword },
                    });
                }
                return { userId, status: 'Password changed successfully' };
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
// 3. Get Users (with pagination and filtering)
function getUsers(dto, requestingUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { role, isActive, search, page, limit } = dto;
        try {
            // Validate requesting user has permission
            const requestingUser = yield prisma.userRoleMapping.findFirst({
                where: { userId: requestingUserId, isActive: true },
                include: { role: true },
            });
            if (!requestingUser) {
                throw { status: 401, message: 'Unauthorized' };
            }
            // Build where clause
            const whereClause = {};
            if (isActive !== undefined) {
                whereClause.isActive = isActive;
            }
            if (search) {
                whereClause.OR = [
                    { username: { contains: search, mode: 'insensitive' } },
                    { name: { contains: search, mode: 'insensitive' } },
                    { mobileNumber: { contains: search } },
                ];
            }
            // If role filter is specified, include role mapping
            let includeClause = {
                userRoleMaps: {
                    where: { isActive: true },
                    include: { role: true },
                },
            };
            if (role) {
                includeClause.userRoleMaps.where.role = { roleName: role };
            }
            const skip = (page - 1) * limit;
            const [users, total] = yield Promise.all([
                prisma.usersMaster.findMany({
                    where: whereClause,
                    include: includeClause,
                    skip,
                    take: limit,
                    orderBy: { username: 'asc' },
                }),
                prisma.usersMaster.count({ where: whereClause }),
            ]);
            return {
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
// 4. Update User Status
function updateUserStatus(dto, updatedById) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, isActive, reason } = dto;
        try {
            // Validate user exists
            const user = yield prisma.usersMaster.findUnique({
                where: { userId },
                include: {
                    userRoleMaps: {
                        where: { isActive: true },
                        include: { role: true },
                    },
                },
            });
            if (!user) {
                throw { status: 404, message: 'User not found' };
            }
            // Prevent deactivating own account
            if (userId === updatedById && !isActive) {
                throw { status: 400, message: 'Cannot deactivate your own account' };
            }
            const result = yield prisma.usersMaster.update({
                where: { userId },
                data: { isActive },
            });
            return {
                userId,
                isActive,
                reason,
                status: 'User status updated successfully',
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
// 5. Delete User (Soft delete)
function deleteUser(dto, deletedById) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, reason } = dto;
        try {
            // Validate user exists
            const user = yield prisma.usersMaster.findUnique({
                where: { userId },
            });
            if (!user) {
                throw { status: 404, message: 'User not found' };
            }
            // Prevent deleting own account
            if (userId === deletedById) {
                throw { status: 400, message: 'Cannot delete your own account' };
            }
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Soft delete user
                yield tx.usersMaster.update({
                    where: { userId },
                    data: { isActive: false },
                });
                // Deactivate role mapping
                yield tx.userRoleMapping.updateMany({
                    where: { userId },
                    data: { isActive: false },
                });
                return { userId, reason, status: 'User deleted successfully' };
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
// 6. Assign Role to User
function assignRole(dto, assignedById) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, role, reason } = dto;
        try {
            // Validate user exists
            const user = yield prisma.usersMaster.findUnique({
                where: { userId },
            });
            if (!user) {
                throw { status: 404, message: 'User not found' };
            }
            // Get role info
            const roleInfo = yield prisma.rolePermissionMaster.findUnique({
                where: { roleName: role },
            });
            if (!roleInfo) {
                throw { status: 400, message: 'Invalid role' };
            }
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Remove existing role mappings
                yield tx.userRoleMapping.updateMany({
                    where: { userId },
                    data: { isActive: false },
                });
                // Create new role mapping
                yield tx.userRoleMapping.create({
                    data: {
                        userId,
                        roleId: roleInfo.roleId,
                        isActive: true,
                    },
                });
                // Create role-specific table entry
                if (role === 'SURVEYOR') {
                    yield tx.surveyors.upsert({
                        where: { userId },
                        update: {},
                        create: {
                            userId,
                            surveyorName: user.description || user.username,
                            username: user.username,
                            password: user.password,
                        },
                    });
                }
                else if (role === 'SUPERVISOR') {
                    yield tx.supervisors.upsert({
                        where: { userId },
                        update: {},
                        create: {
                            userId,
                            supervisorName: user.description || user.username,
                            username: user.username,
                            password: user.password,
                        },
                    });
                }
                else if (role === 'ADMIN' || role === 'SUPERADMIN') {
                    yield tx.admins.upsert({
                        where: { userId },
                        update: {},
                        create: {
                            userId,
                            adminName: user.description || user.username,
                            username: user.username,
                            password: user.password,
                        },
                    });
                }
                return { userId, role, reason, status: 'Role assigned successfully' };
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
// 7. Remove Role from User
function removeRole(dto, removedById) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, reason } = dto;
        try {
            // Validate user exists
            const user = yield prisma.usersMaster.findUnique({
                where: { userId },
                include: {
                    userRoleMaps: {
                        where: { isActive: true },
                        include: { role: true },
                    },
                },
            });
            if (!user) {
                throw { status: 404, message: 'User not found' };
            }
            if (user.userRoleMaps.length === 0) {
                throw { status: 400, message: 'User has no active roles' };
            }
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                // Deactivate role mappings
                yield tx.userRoleMapping.updateMany({
                    where: { userId },
                    data: { isActive: false },
                });
                // Remove from role-specific tables
                const userRole = (_a = user.userRoleMaps[0]) === null || _a === void 0 ? void 0 : _a.role.roleName;
                if (userRole === 'SURVEYOR') {
                    yield tx.surveyors.delete({ where: { userId } });
                }
                else if (userRole === 'SUPERVISOR') {
                    yield tx.supervisors.delete({ where: { userId } });
                }
                else if (userRole === 'ADMIN' || userRole === 'SUPERADMIN') {
                    yield tx.admins.delete({ where: { userId } });
                }
                return { userId, reason, status: 'Role removed successfully' };
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
// 8. Get User Statistics
function getUserStats(dto) {
    return __awaiter(this, void 0, void 0, function* () {
        const { role, wardId, dateFrom, dateTo } = dto;
        try {
            const whereClause = {};
            if (role) {
                whereClause.userRoleMaps = {
                    some: {
                        isActive: true,
                        role: { roleName: role },
                    },
                };
            }
            if (dateFrom || dateTo) {
                whereClause.isCreatedAt = {};
                if (dateFrom)
                    whereClause.isCreatedAt.gte = new Date(dateFrom);
                if (dateTo)
                    whereClause.isCreatedAt.lte = new Date(dateTo);
            }
            const [totalUsers, activeUsers, inactiveUsers] = yield Promise.all([
                prisma.usersMaster.count({ where: whereClause }),
                prisma.usersMaster.count({ where: Object.assign(Object.assign({}, whereClause), { isActive: true }) }),
                prisma.usersMaster.count({ where: Object.assign(Object.assign({}, whereClause), { isActive: false }) }),
            ]);
            // Role-wise statistics
            const roleStats = yield prisma.userRoleMapping.groupBy({
                by: ['roleId'],
                where: { isActive: true },
                _count: { userId: true },
            });
            // Get role names for the statistics
            const roleIds = roleStats.map(stat => stat.roleId);
            const roles = yield prisma.rolePermissionMaster.findMany({
                where: { roleId: { in: roleIds } },
                select: { roleId: true, roleName: true },
            });
            const roleMap = new Map(roles.map(role => [role.roleId, role.roleName]));
            return {
                totalUsers,
                activeUsers,
                inactiveUsers,
                roleStats: roleStats.map(stat => ({
                    role: roleMap.get(stat.roleId) || 'Unknown',
                    count: stat._count.userId,
                })),
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
// 9. Search Users
function searchUsers(dto) {
    return __awaiter(this, void 0, void 0, function* () {
        const { query, role, isActive, limit } = dto;
        try {
            const whereClause = {
                OR: [
                    { username: { contains: query, mode: 'insensitive' } },
                    { name: { contains: query, mode: 'insensitive' } },
                    { mobileNumber: { contains: query } },
                ],
            };
            if (isActive !== undefined) {
                whereClause.isActive = isActive;
            }
            if (role) {
                whereClause.userRoleMaps = {
                    some: {
                        isActive: true,
                        role: { roleName: role },
                    },
                };
            }
            const users = yield prisma.usersMaster.findMany({
                where: whereClause,
                include: {
                    userRoleMaps: {
                        where: { isActive: true },
                        include: { role: true },
                    },
                },
                take: limit,
                orderBy: { username: 'asc' },
            });
            return { users };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
// 10. Get User Profile
function getUserProfile(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const user = yield prisma.usersMaster.findUnique({
                where: { userId },
                include: {
                    userRoleMaps: {
                        where: { isActive: true },
                        include: { role: true },
                    },
                },
            });
            if (!user) {
                throw { status: 404, message: 'User not found' };
            }
            return {
                userId: user.userId,
                username: user.username,
                name: user.name,
                mobileNumber: user.mobileNumber,
                isActive: user.isActive,
                role: ((_a = user.userRoleMaps[0]) === null || _a === void 0 ? void 0 : _a.role.roleName) || null,
                createdAt: user.isCreatedAt,
            };
        }
        catch (err) {
            if (!err.status)
                console.error(err);
            throw err.status ? err : { status: 500, message: 'Internal server error' };
        }
    });
}
