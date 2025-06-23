"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSurveyorAssignmentsSchema = exports.RemoveWardAssignmentSchema = exports.ToggleLoginSchema = exports.AssignWardSchema = void 0;
const zod_1 = require("zod");
exports.AssignWardSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    wardId: zod_1.z.string().uuid(),
    mohallaId: zod_1.z.string().uuid(),
    wardMohallaMapId: zod_1.z.string().uuid(),
    zoneWardMapId: zod_1.z.string().uuid(),
    ulbZoneMapId: zod_1.z.string().uuid(),
    assignmentType: zod_1.z.enum(['PRIMARY', 'SECONDARY']).default('PRIMARY'),
});
exports.ToggleLoginSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    isActive: zod_1.z.boolean(),
});
exports.RemoveWardAssignmentSchema = zod_1.z.object({
    assignmentId: zod_1.z.string().uuid(),
});
exports.GetSurveyorAssignmentsSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
});
