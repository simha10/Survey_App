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
exports.getActiveUsersCount = exports.getUsersByRole = exports.getAvailableRoles = exports.getUserById = exports.getUserProfile = exports.searchUsers = exports.getUserStats = exports.removeRole = exports.assignRole = exports.deleteUser = exports.updateUserStatus = exports.getUsers = exports.changePassword = exports.updateProfile = void 0;
const userService = __importStar(require("../services/userService"));
const userDto_1 = require("../dtos/userDto");
// 1. Update User Profile
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = userDto_1.UpdateProfileSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const userId = req.user.userId;
        const result = yield userService.updateProfile(parsed.data, userId);
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
exports.updateProfile = updateProfile;
// 2. Change Password
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = userDto_1.ChangePasswordSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const userId = req.user.userId;
        const result = yield userService.changePassword(parsed.data, userId);
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
exports.changePassword = changePassword;
// 3. Get Users (with pagination and filtering)
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = userDto_1.GetUsersSchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid query parameters' });
        }
        const requestingUserId = req.user.userId;
        const result = yield userService.getUsers(parsed.data, requestingUserId);
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
exports.getUsers = getUsers;
// 4. Update User Status
const updateUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = userDto_1.UpdateUserStatusSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const updatedById = req.user.userId;
        const result = yield userService.updateUserStatus(parsed.data, updatedById);
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
exports.updateUserStatus = updateUserStatus;
// 5. Delete User (Soft delete)
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = userDto_1.DeleteUserSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const deletedById = req.user.userId;
        const result = yield userService.deleteUser(parsed.data, deletedById);
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
exports.deleteUser = deleteUser;
// 6. Assign Role to User
const assignRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = userDto_1.AssignRoleSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const assignedById = req.user.userId;
        const result = yield userService.assignRole(parsed.data, assignedById);
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
exports.assignRole = assignRole;
// 7. Remove Role from User
const removeRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = userDto_1.RemoveRoleSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid input data' });
        }
        const removedById = req.user.userId;
        const result = yield userService.removeRole(parsed.data, removedById);
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
exports.removeRole = removeRole;
// 8. Get User Statistics
const getUserStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = userDto_1.GetUserStatsSchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid query parameters' });
        }
        const result = yield userService.getUserStats(parsed.data);
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
exports.getUserStats = getUserStats;
// 9. Search Users
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = userDto_1.SearchUsersSchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid query parameters' });
        }
        const result = yield userService.searchUsers(parsed.data);
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
exports.searchUsers = searchUsers;
// 10. Get User Profile
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const result = yield userService.getUserProfile(userId);
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
exports.getUserProfile = getUserProfile;
// 11. Get User by ID (for admin purposes)
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield userService.getUserProfile(userId);
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
exports.getUserById = getUserById;
// 12. Get Available Roles (for dropdowns)
const getAvailableRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const roles = yield prisma.rolePermissionMaster.findMany({
            where: { isActive: true },
            select: {
                roleId: true,
                roleName: true,
                description: true,
            },
            orderBy: { roleName: 'asc' },
        });
        return res.status(200).json({ roles });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAvailableRoles = getAvailableRoles;
// 13. Get Users by Role
const getUsersByRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.params;
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const users = yield prisma.usersMaster.findMany({
            where: {
                isActive: true,
                userRoleMaps: {
                    some: {
                        isActive: true,
                        role: { roleName: role },
                    },
                },
            },
            include: {
                userRoleMaps: {
                    where: { isActive: true },
                    include: { role: true },
                },
            },
            orderBy: { username: 'asc' },
        });
        return res.status(200).json({ users });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getUsersByRole = getUsersByRole;
// 14. Get Active Users Count
const getActiveUsersCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const [totalUsers, activeUsers] = yield Promise.all([
            prisma.usersMaster.count(),
            prisma.usersMaster.count({ where: { isActive: true } }),
        ]);
        return res.status(200).json({
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getActiveUsersCount = getActiveUsersCount;
