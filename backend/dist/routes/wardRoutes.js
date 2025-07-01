"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wardController = __importStar(require("../controllers/wardController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const wardController_1 = require("../controllers/wardController");
const router = (0, express_1.Router)();
// ========================================
// WARD ASSIGNMENT ROUTES
// ========================================
// Assign ward to surveyor (ADMIN/SUPERADMIN only)
router.post('/assign-surveyor', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERADMIN', 'ADMIN']), wardController.assignWardToSurveyor);
// Assign ward to supervisor (ADMIN/SUPERADMIN only)
router.post('/assign-supervisor', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERADMIN', 'ADMIN']), wardController.assignWardToSupervisor);
// Bulk ward assignment (ADMIN/SUPERADMIN only)
router.post('/bulk-assign', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERADMIN', 'ADMIN']), wardController.bulkWardAssignment);
// Update ward assignment status (ADMIN/SUPERADMIN/SUPERVISOR)
router.put('/update-assignment', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERADMIN', 'ADMIN', 'SUPERVISOR']), wardController.updateWardAssignment);
// ========================================
// ACCESS CONTROL ROUTES
// ========================================
// Toggle surveyor access (SUPERVISOR/ADMIN/SUPERADMIN)
router.put('/toggle-access', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERVISOR', 'ADMIN', 'SUPERADMIN']), wardController.toggleSurveyorAccess);
// ========================================
// SUPERVISOR MANAGEMENT ROUTES
// ========================================
// Assign supervisor to ward (ADMIN/SUPERADMIN only)
router.post('/assign-supervisor-to-ward', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERADMIN', 'ADMIN']), wardController.assignSupervisorToWard);
// Remove supervisor from ward (ADMIN/SUPERADMIN only)
router.delete('/remove-supervisor-from-ward', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERADMIN', 'ADMIN']), wardController.removeSupervisorFromWard);
// ========================================
// WARD STATUS ROUTES
// ========================================
// Update ward status (ADMIN/SUPERADMIN only)
router.put('/update-status', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERADMIN', 'ADMIN']), wardController.updateWardStatus);
// ========================================
// QUERY ROUTES (All authenticated users)
// ========================================
// Get ward assignments (filtered by role)
router.get('/assignments', authMiddleware_1.authenticateJWT, wardController.getWardAssignments);
// Get available wards for dropdowns
router.get('/available-wards', authMiddleware_1.authenticateJWT, wardController.getAvailableWards);
// Get available mohallas for dropdowns
router.get('/available-mohallas', authMiddleware_1.authenticateJWT, wardController.getAvailableMohallas);
// Get ward-mohalla mappings
router.get('/ward-mohalla-mappings', authMiddleware_1.authenticateJWT, wardController.getWardMohallaMappings);
// Get surveyors by ward
router.get('/surveyors/:wardId', authMiddleware_1.authenticateJWT, wardController.getSurveyorsByWard);
// Get supervisors by ward
router.get('/supervisors/:wardId', authMiddleware_1.authenticateJWT, wardController.getSupervisorsByWard);
// Get all wards
router.get('/', authMiddleware_1.authenticateJWT, wardController_1.getAllWards);
// Get wards by zone
router.get('/zone/:zoneId', authMiddleware_1.authenticateJWT, wardController_1.getWardsByZone);
// Get all ward statuses
router.get('/statuses', authMiddleware_1.authenticateJWT, wardController_1.getAllWardStatuses);
exports.default = router;
