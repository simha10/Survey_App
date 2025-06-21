import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    roles: string[];
  };
}

export async function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

    const userRoleMappings = await prisma.userRoleMapping.findMany({
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
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function restrictToRoles(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !user.roles || !user.roles.some(role => allowedRoles.includes(role))) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
  };
}

export async function restrictToSurveyor(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const mapping = await prisma.userRoleMapping.findFirst({
    where: { userId, isActive: true },
    include: { role: true },
  });
  if (!mapping || mapping.role.roleName !== 'SURVEYOR') {
    return res.status(400).json({ error: 'Invalid surveyor' });
  }
  next();
}