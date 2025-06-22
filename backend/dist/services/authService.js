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
exports.login = login;
exports.register = register;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authDto_1 = require("../dtos/authDto");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
function login(dto) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate input
        const parsed = authDto_1.LoginSchema.safeParse(dto);
        if (!parsed.success) {
            throw { status: 400, message: 'Missing required fields' };
        }
        const { username, password, role } = parsed.data;
        try {
            // Find user by username
            const user = yield prisma.usersMaster.findFirst({ where: { username } });
            if (!user)
                throw { status: 401, message: 'Invalid credentials' };
            // Check password
            const valid = yield bcrypt_1.default.compare(password, user.password);
            if (!valid)
                throw { status: 401, message: 'Invalid credentials' };
            // Get user role
            const userRoleMap = yield prisma.userRoleMapping.findFirst({
                where: { userId: user.userId, isActive: true },
                include: { role: true },
            });
            if (!userRoleMap || userRoleMap.role.roleName !== role) {
                throw { status: 401, message: 'Invalid credentials' };
            }
            // Generate JWT
            const token = jsonwebtoken_1.default.sign({ userId: user.userId, role: userRoleMap.role.roleName }, JWT_SECRET, { expiresIn: '1h' });
            return {
                token,
                user: {
                    userId: user.userId,
                    username: user.username,
                    role: userRoleMap.role.roleName,
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
function register(dto, creator) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, username, password, role, mobileNumber } = dto;
        try {
            // Check username uniqueness
            const existing = yield prisma.usersMaster.findFirst({ where: { username } });
            if (existing)
                throw { status: 409, message: 'Username already exists' };
            // Get role info by role name
            const roleRecord = yield prisma.rolePermissionMaster.findUnique({ where: { roleName: role } });
            if (!roleRecord)
                throw { status: 400, message: 'Invalid role' };
            // RBAC enforcement
            if (creator.role === 'ADMIN' && !(roleRecord.roleName === 'SUPERVISOR' || roleRecord.roleName === 'SURVEYOR')) {
                throw { status: 403, message: 'Unauthorized role creation' };
            }
            // Hash password
            const hashed = yield bcrypt_1.default.hash(password, 10);
            // Transaction: create user, role mapping, and role-specific table
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Create UsersMaster
                const user = yield tx.usersMaster.create({
                    data: {
                        username,
                        password: hashed,
                        isActive: true,
                        mobileNumber: mobileNumber,
                    },
                });
                // Create UserRoleMapping
                yield tx.userRoleMapping.create({
                    data: {
                        userId: user.userId,
                        roleId: roleRecord.roleId,
                        isActive: true,
                    },
                });
                // Create role-specific table
                if (roleRecord.roleName === 'SURVEYOR') {
                    yield tx.surveyors.create({
                        data: {
                            userId: user.userId,
                            surveyorName: name,
                            username,
                            password: hashed,
                        },
                    });
                }
                else if (roleRecord.roleName === 'SUPERVISOR') {
                    yield tx.supervisors.create({
                        data: {
                            userId: user.userId,
                            supervisorName: name,
                            username,
                            password: hashed,
                        },
                    });
                }
                else if (roleRecord.roleName === 'ADMIN' || roleRecord.roleName === 'SUPERADMIN') {
                    yield tx.admins.create({
                        data: {
                            userId: user.userId,
                            adminName: name,
                            username,
                            password: hashed,
                        },
                    });
                }
                return {
                    userId: user.userId,
                    username: user.username,
                    role: roleRecord.roleName,
                };
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
