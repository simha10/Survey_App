import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginSchema, RegisterSchema, LoginDto, RegisterDto } from '../dtos/authDto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function login(dto: LoginDto) {
  // Validate input
  const parsed = LoginSchema.safeParse(dto);
  if (!parsed.success) {
    throw { status: 400, message: 'Missing required fields' };
  }
  const { username, password, role } = parsed.data;
  try {
    // Find user by username
    const user = await prisma.usersMaster.findFirst({ where: { username } });
    if (!user) throw { status: 401, message: 'Invalid credentials' };
    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw { status: 401, message: 'Invalid credentials' };
    // Get user role
    const userRoleMap = await prisma.userRoleMapping.findFirst({
      where: { userId: user.userId, isActive: true },
      include: { role: true },
    });
    if (!userRoleMap || userRoleMap.role.roleName !== role) {
      throw { status: 401, message: 'Invalid credentials' };
    }
    // Generate JWT
    const token = jwt.sign(
      { userId: user.userId, role: userRoleMap.role.roleName },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return {
      token,
      user: {
        userId: user.userId,
        username: user.username,
        role: userRoleMap.role.roleName,
      },
    };
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}


export async function register(dto: RegisterDto, creator: any) {
  const { name, username, password, role, mobileNumber } = dto;
  try {
    // Check username uniqueness
    const existing = await prisma.usersMaster.findFirst({ where: { username } });
    if (existing) throw { status: 409, message: 'Username already exists' };
    // Get role info by role name
    const roleRecord = await prisma.rolePermissionMaster.findUnique({ where: { roleName: role } });
    if (!roleRecord) throw { status: 400, message: 'Invalid role' };
    // RBAC enforcement
    if (creator.role === 'ADMIN' && !(roleRecord.roleName === 'SUPERVISOR' || roleRecord.roleName === 'SURVEYOR')) {
      throw { status: 403, message: 'Unauthorized role creation' };
    }
    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    // Transaction: create user, role mapping, and role-specific table
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create UsersMaster
      const user = await tx.usersMaster.create({
        data: {
          username,
          name,
          password: hashed,
          isActive: true,
          mobileNumber: mobileNumber,
        },
      });
      // Create UserRoleMapping
      await tx.userRoleMapping.create({
        data: {
          userId: user.userId,
          roleId: roleRecord.roleId,
          isActive: true,
        },
      });
      // Create role-specific table
      if (roleRecord.roleName === 'SURVEYOR') {
        await tx.surveyors.create({
          data: {
            userId: user.userId,
            surveyorName: name,
            username,
            password: hashed,
          },
        });
      } else if (roleRecord.roleName === 'SUPERVISOR') {
        await tx.supervisors.create({
          data: {
            userId: user.userId,
            supervisorName: name,
            username,
            password: hashed,
          },
        });
      } else if (roleRecord.roleName === 'ADMIN' || roleRecord.roleName === 'SUPERADMIN') {
        await tx.admins.create({
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
        name: user.name,
        role: roleRecord.roleName,
      };
    });
    return result;
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}