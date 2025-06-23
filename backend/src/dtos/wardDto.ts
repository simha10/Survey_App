import { z } from 'zod';

// Ward Assignment DTOs
export const AssignWardToSurveyorSchema = z.object({
  surveyorId: z.string().uuid(),
  wardId: z.string().uuid(),
  mohallaId: z.string().uuid(),
  wardMohallaMapId: z.string().uuid(),
  zoneWardMapId: z.string().uuid(),
  ulbZoneMapId: z.string().uuid(),
  assignmentType: z.enum(['PRIMARY', 'SECONDARY']).default('PRIMARY'),
  supervisorId: z.string().uuid().optional(), // Optional supervisor assignment
});
export type AssignWardToSurveyorDto = z.infer<typeof AssignWardToSurveyorSchema>;

export const AssignWardToSupervisorSchema = z.object({
  supervisorId: z.string().uuid(),
  wardIds: z.array(z.string().uuid()).min(1),
  isActive: z.boolean().default(true),
});
export type AssignWardToSupervisorDto = z.infer<typeof AssignWardToSupervisorSchema>;

// Ward Management DTOs
export const UpdateWardAssignmentSchema = z.object({
  assignmentId: z.string().uuid(),
  isActive: z.boolean(),
  reason: z.string().optional(),
});
export type UpdateWardAssignmentDto = z.infer<typeof UpdateWardAssignmentSchema>;

export const BulkWardAssignmentSchema = z.object({
  surveyorId: z.string().uuid(),
  assignments: z.array(z.object({
    wardId: z.string().uuid(),
    mohallaId: z.string().uuid(),
    wardMohallaMapId: z.string().uuid(),
    zoneWardMapId: z.string().uuid(),
    ulbZoneMapId: z.string().uuid(),
    assignmentType: z.enum(['PRIMARY', 'SECONDARY']).default('PRIMARY'),
  })),
  supervisorId: z.string().uuid().optional(),
});
export type BulkWardAssignmentDto = z.infer<typeof BulkWardAssignmentSchema>;

// Access Control DTOs
export const ToggleSurveyorAccessSchema = z.object({
  surveyorId: z.string().uuid(),
  wardId: z.string().uuid().optional(), // If not provided, affects all wards
  isActive: z.boolean(),
  reason: z.string().optional(),
  actionBy: z.enum(['SUPERVISOR', 'ADMIN', 'SUPERADMIN']),
});
export type ToggleSurveyorAccessDto = z.infer<typeof ToggleSurveyorAccessSchema>;

export const GetWardAssignmentsSchema = z.object({
  wardId: z.string().uuid().optional(),
  surveyorId: z.string().uuid().optional(),
  supervisorId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
});
export type GetWardAssignmentsDto = z.infer<typeof GetWardAssignmentsSchema>;

// Ward Status DTOs
export const UpdateWardStatusSchema = z.object({
  wardId: z.string().uuid(),
  statusId: z.string().uuid(),
  reason: z.string().optional(),
});
export type UpdateWardStatusDto = z.infer<typeof UpdateWardStatusSchema>;

// Supervisor Management DTOs
export const AssignSupervisorToWardSchema = z.object({
  supervisorId: z.string().uuid(),
  wardId: z.string().uuid(),
  isActive: z.boolean().default(true),
});
export type AssignSupervisorToWardDto = z.infer<typeof AssignSupervisorToWardSchema>;

export const RemoveSupervisorFromWardSchema = z.object({
  supervisorId: z.string().uuid(),
  wardId: z.string().uuid(),
  reason: z.string().optional(),
});
export type RemoveSupervisorFromWardDto = z.infer<typeof RemoveSupervisorFromWardSchema>; 