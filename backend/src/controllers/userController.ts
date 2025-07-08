import { Request, Response } from 'express';
import * as userService from '../services/userService';
import {
  UpdateProfileSchema,
  ChangePasswordSchema,
  GetUsersSchema,
  UpdateUserStatusSchema,
  DeleteUserSchema,
  AssignRoleSchema,
  RemoveRoleSchema,
  GetUserStatsSchema,
  GetUserActivitySchema,
  SearchUsersSchema,
  UpdateUserSchema,
} from '../dtos/userDto';

// 1. Update User Profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const parsed = UpdateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const userId = (req as any).user.userId;
    const result = await userService.updateProfile(parsed.data, userId);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 2. Change Password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const parsed = ChangePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const userId = (req as any).user.userId;
    const result = await userService.changePassword(parsed.data, userId);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 3. Get Users (with pagination and filtering)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const parsed = GetUsersSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    const requestingUserId = (req as any).user.userId;
    const result = await userService.getUsers(parsed.data, requestingUserId);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 4. Update User Status
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const parsed = UpdateUserStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const updatedById = (req as any).user.userId;
    const result = await userService.updateUserStatus(parsed.data, updatedById);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 5. Delete User (Soft delete)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const parsed = DeleteUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const deletedById = (req as any).user.userId;
    const result = await userService.deleteUser(parsed.data, deletedById);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 6. Assign Role to User
export const assignRole = async (req: Request, res: Response) => {
  try {
    const parsed = AssignRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const assignedById = (req as any).user.userId;
    const result = await userService.assignRole(parsed.data, assignedById);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 7. Remove Role from User
export const removeRole = async (req: Request, res: Response) => {
  try {
    const parsed = RemoveRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const removedById = (req as any).user.userId;
    const result = await userService.removeRole(parsed.data, removedById);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 8. Get User Statistics
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const parsed = GetUserStatsSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    const result = await userService.getUserStats(parsed.data);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 9. Search Users
export const searchUsers = async (req: Request, res: Response) => {
  try {
    const parsed = SearchUsersSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    const result = await userService.searchUsers(parsed.data);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 10. Get User Profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const result = await userService.getUserProfile(userId);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 11. Get User by ID (for admin purposes)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await userService.getUserProfile(userId);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 12. Get Available Roles (for dropdowns)
export const getAvailableRoles = async (req: Request, res: Response) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const roles = await prisma.rolePermissionMaster.findMany({
      where: { isActive: true },
      select: {
        roleId: true,
        roleName: true,
        description: true,
      },
      orderBy: { roleName: 'asc' },
    });

    return res.status(200).json({ roles });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 13. Get Users by Role
export const getUsersByRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const users = await prisma.usersMaster.findMany({
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
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 14. Get Active Users Count
export const getActiveUsersCount = async (req: Request, res: Response) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const [totalUsers, activeUsers] = await Promise.all([
      prisma.usersMaster.count(),
      prisma.usersMaster.count({ where: { isActive: true } }),
    ]);

    return res.status(200).json({
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 15. Update User (for admin purposes)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const parsed = UpdateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const updatedById = (req as any).user.userId;
    const result = await userService.updateUser(parsed.data, updatedById);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 