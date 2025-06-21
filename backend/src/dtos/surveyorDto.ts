import { z } from 'zod';

export const AssignWardSchema = z.object({
  userId: z.string().uuid(),
  wardId: z.string().uuid(),
  mohallaId: z.string().uuid(),
  wardMohallaMapId: z.string().uuid(),
  zoneWardMapId: z.string().uuid(),
  ulbZoneMapId: z.string().uuid(),
});
export type AssignWardDto = z.infer<typeof AssignWardSchema>;

export const ToggleLoginSchema = z.object({
  userId: z.string().uuid(),
  isActive: z.boolean(),
});
export type ToggleLoginDto = z.infer<typeof ToggleLoginSchema>;