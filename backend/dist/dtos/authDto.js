"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
// DTOs for authentication
exports.LoginSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50),
    password: zod_1.z.string().min(8),
    role: zod_1.z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR']),
});
exports.RegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(50),
    username: zod_1.z.string().min(3).max(50),
    password: zod_1.z.string().min(8),
    role: zod_1.z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR']),
    mobileNumber: zod_1.z.string().length(10, { message: "Mobile number must be 10 digits" }),
});
