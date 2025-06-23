"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveSupervisorFromWardSchema = exports.AssignSupervisorToWardSchema = exports.UpdateWardStatusSchema = exports.GetWardAssignmentsSchema = exports.ToggleSurveyorAccessSchema = exports.BulkWardAssignmentSchema = exports.UpdateWardAssignmentSchema = exports.AssignWardToSupervisorSchema = exports.AssignWardToSurveyorSchema = void 0;
const zod_1 = require("zod");
// Ward Assignment DTOs
exports.AssignWardToSurveyorSchema = zod_1.z.object({
    surveyorId: zod_1.z.string().uuid(),
    wardId: zod_1.z.string().uuid(),
    mohallaId: zod_1.z.string().uuid(),
    wardMohallaMapId: zod_1.z.string().uuid(),
    zoneWardMapId: zod_1.z.string().uuid(),
    ulbZoneMapId: zod_1.z.string().uuid(),
    assignmentType: zod_1.z.enum(['PRIMARY', 'SECONDARY']).default('PRIMARY'),
    supervisorId: zod_1.z.string().uuid().optional(), // Optional supervisor assignment
});
exports.AssignWardToSupervisorSchema = zod_1.z.object({
    supervisorId: zod_1.z.string().uuid(),
    wardIds: zod_1.z.array(zod_1.z.string().uuid()).min(1),
    isActive: zod_1.z.boolean().default(true),
});
// Ward Management DTOs
exports.UpdateWardAssignmentSchema = zod_1.z.object({
    assignmentId: zod_1.z.string().uuid(),
    isActive: zod_1.z.boolean(),
    reason: zod_1.z.string().optional(),
});
exports.BulkWardAssignmentSchema = zod_1.z.object({
    surveyorId: zod_1.z.string().uuid(),
    assignments: zod_1.z.array(zod_1.z.object({
        wardId: zod_1.z.string().uuid(),
        mohallaId: zod_1.z.string().uuid(),
        wardMohallaMapId: zod_1.z.string().uuid(),
        zoneWardMapId: zod_1.z.string().uuid(),
        ulbZoneMapId: zod_1.z.string().uuid(),
        assignmentType: zod_1.z.enum(['PRIMARY', 'SECONDARY']).default('PRIMARY'),
    })),
    supervisorId: zod_1.z.string().uuid().optional(),
});
// Access Control DTOs
exports.ToggleSurveyorAccessSchema = zod_1.z.object({
    surveyorId: zod_1.z.string().uuid(),
    wardId: zod_1.z.string().uuid().optional(), // If not provided, affects all wards
    isActive: zod_1.z.boolean(),
    reason: zod_1.z.string().optional(),
    actionBy: zod_1.z.enum(['SUPERVISOR', 'ADMIN', 'SUPERADMIN']),
});
exports.GetWardAssignmentsSchema = zod_1.z.object({
    wardId: zod_1.z.string().uuid().optional(),
    surveyorId: zod_1.z.string().uuid().optional(),
    supervisorId: zod_1.z.string().uuid().optional(),
    isActive: zod_1.z.boolean().optional(),
});
// Ward Status DTOs
exports.UpdateWardStatusSchema = zod_1.z.object({
    wardId: zod_1.z.string().uuid(),
    statusId: zod_1.z.string().uuid(),
    reason: zod_1.z.string().optional(),
});
// Supervisor Management DTOs
exports.AssignSupervisorToWardSchema = zod_1.z.object({
    supervisorId: zod_1.z.string().uuid(),
    wardId: zod_1.z.string().uuid(),
    isActive: zod_1.z.boolean().default(true),
});
exports.RemoveSupervisorFromWardSchema = zod_1.z.object({
    supervisorId: zod_1.z.string().uuid(),
    wardId: zod_1.z.string().uuid(),
    reason: zod_1.z.string().optional(),
});
