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
exports.authenticateJWT = authenticateJWT;
exports.restrictToRoles = restrictToRoles;
exports.restrictToSurveyor = restrictToSurveyor;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const prisma = new client_1.PrismaClient();
function authenticateJWT(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid token' });
        }
        const token = authHeader.split(' ')[1];
        try {
            const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const userRoleMappings = yield prisma.userRoleMapping.findMany({
                where: { userId: payload.userId, isActive: true },
                include: { role: true },
            });
            if (!userRoleMappings.length) {
                return res.status(403).json({ error: 'User has no active roles' });
            }
            const roles = userRoleMappings.map((mapping) => mapping.role.roleName);
            req.user = {
                userId: payload.userId,
                roles,
            };
            next();
        }
        catch (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    });
}
function restrictToRoles(allowedRoles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !user.roles || !user.roles.some(role => allowedRoles.includes(role))) {
            return res.status(403).json({ error: 'Forbidden: insufficient role' });
        }
        next();
    };
}
function restrictToSurveyor(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.body;
        if (!userId)
            return res.status(400).json({ error: 'userId required' });
        const mapping = yield prisma.userRoleMapping.findFirst({
            where: { userId, isActive: true },
            include: { role: true },
        });
        if (!mapping || mapping.role.roleName !== 'SURVEYOR') {
            return res.status(400).json({ error: 'Invalid surveyor' });
        }
        next();
    });
}
