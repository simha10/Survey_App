"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchUsersSchema = exports.GetUserActivitySchema = exports.GetUserStatsSchema = exports.RemoveRoleSchema = exports.AssignRoleSchema = exports.DeleteUserSchema = exports.UpdateUserStatusSchema = exports.GetUsersSchema = exports.ChangePasswordSchema = exports.UpdateProfileSchema = void 0;
const zod_1 = require("zod");
// User Profile DTOs
exports.UpdateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    mobileNumber: zod_1.z.string().regex(/^[0-9]{10}$/).optional(),
    email: zod_1.z.string().email().optional(), // This will be stored in description field
});
exports.ChangePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(8),
    newPassword: zod_1.z.string().min(8),
    confirmPassword: zod_1.z.string().min(8),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
// User Management DTOs
exports.GetUsersSchema = zod_1.z.object({
    role: zod_1.z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR']).optional(),
    isActive: zod_1.z.boolean().optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.number().min(1).default(1),
    limit: zod_1.z.number().min(1).max(100).default(10),
});
exports.UpdateUserStatusSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    isActive: zod_1.z.boolean(),
    reason: zod_1.z.string().optional(),
});
exports.DeleteUserSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    reason: zod_1.z.string().optional(),
});
// User Role Management DTOs
exports.AssignRoleSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    role: zod_1.z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR']),
    reason: zod_1.z.string().optional(),
});
exports.RemoveRoleSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    reason: zod_1.z.string().optional(),
});
// User Statistics DTOs
exports.GetUserStatsSchema = zod_1.z.object({
    role: zod_1.z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR']).optional(),
    wardId: zod_1.z.string().uuid().optional(),
    dateFrom: zod_1.z.string().optional(),
    dateTo: zod_1.z.string().optional(),
});
// User Activity DTOs
exports.GetUserActivitySchema = zod_1.z.object({
    userId: zod_1.z.string().uuid().optional(),
    activityType: zod_1.z.enum(['LOGIN', 'LOGOUT', 'SURVEY_CREATED', 'SURVEY_UPDATED', 'WARD_ASSIGNED']).optional(),
    dateFrom: zod_1.z.string().optional(),
    dateTo: zod_1.z.string().optional(),
    page: zod_1.z.number().min(1).default(1),
    limit: zod_1.z.number().min(1).max(100).default(10),
});
// User Search DTOs
exports.SearchUsersSchema = zod_1.z.object({
    query: zod_1.z.string().min(1),
    role: zod_1.z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR']).optional(),
    isActive: zod_1.z.boolean().optional(),
    limit: zod_1.z.number().min(1).max(50).default(10),
});
