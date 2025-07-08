import { z } from 'zod';

// User Profile DTOs
export const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  mobileNumber: z.string().regex(/^[0-9]{10}$/).optional(),
  email: z.string().email().optional(), // This will be stored in description field
});
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;

// User Management DTOs
export const GetUsersSchema = z.object({
  role: z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR']).optional(),
  isActive: z.boolean().optional(), 
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});
export type GetUsersDto = z.infer<typeof GetUsersSchema>;

export const UpdateUserStatusSchema = z.object({
  userId: z.string().uuid(),
  isActive: z.boolean(),
  reason: z.string().optional(),
});
export type UpdateUserStatusDto = z.infer<typeof UpdateUserStatusSchema>;

export const DeleteUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().optional(),
  hardDelete: z.boolean().optional(),
});
export type DeleteUserDto = z.infer<typeof DeleteUserSchema>;

// User Role Management DTOs
export const AssignRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR']),
  reason: z.string().optional(),
});
export type AssignRoleDto = z.infer<typeof AssignRoleSchema>;

export const RemoveRoleSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().optional(),
});
export type RemoveRoleDto = z.infer<typeof RemoveRoleSchema>;

// User Statistics DTOs
export const GetUserStatsSchema = z.object({
  role: z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR']).optional(),
  wardId: z.string().uuid().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});
export type GetUserStatsDto = z.infer<typeof GetUserStatsSchema>;

// User Activity DTOs
export const GetUserActivitySchema = z.object({
  userId: z.string().uuid().optional(),
  activityType: z.enum(['LOGIN', 'LOGOUT', 'SURVEY_CREATED', 'SURVEY_UPDATED', 'WARD_ASSIGNED']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});
export type GetUserActivityDto = z.infer<typeof GetUserActivitySchema>;

// User Search DTOs
export const SearchUsersSchema = z.object({
  query: z.string().min(1),
  role: z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR']).optional(),
  isActive: z.boolean().optional(),
  limit: z.number().min(1).max(50).default(10),
});
export type SearchUsersDto = z.infer<typeof SearchUsersSchema>;

// Response DTOs for better type safety
export interface UserProfileResponse {
  userId: string;
  username: string;
  name: string | null; // This now comes from the name field
  mobileNumber: string | null;
  email: string | null; // This comes from the request, not stored in DB
  isActive: boolean;
  role: string | null;
  createdAt: Date;
  status?: string;
}

export interface UserListResponse {
  users: Array<{
    userId: string;
    username: string;
    name: string | null; // Updated to use name field
    mobileNumber: string | null;
    isActive: boolean;
    isCreatedAt: Date;
    userRoleMaps: Array<{
      role: {
        roleName: string;
      };
    }>;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserStatsResponse {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  roleStats: Array<{
    role: string;
    count: number;
  }>;
}

export const UpdateUserSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(2).max(100).optional(),
  mobileNumber: z.string().regex(/^[0-9]{10}$/).optional(),
  password: z.string().min(8).optional(),
});
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>; 