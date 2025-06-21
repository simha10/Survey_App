import { z } from 'zod';

// DTOs for authentication
export const LoginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  role: z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR']),
});
export type LoginDto = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(3).max(50),
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  role: z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR']),
  mobileNumber: z.string().min(10).max(10),
});
export type RegisterDto = z.infer<typeof RegisterSchema>;