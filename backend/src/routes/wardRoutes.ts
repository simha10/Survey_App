import { Router } from 'express';
import * as wardController from '../controllers/wardController';
import { authenticateJWT, restrictToRoles } from '../middleware/authMiddleware';

const router = Router();

// ========================================
// WARD ASSIGNMENT ROUTES
// ========================================

// Assign ward to surveyor (ADMIN/SUPERADMIN only)
router.post(
  '/assign-surveyor',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  wardController.assignWardToSurveyor
);

// Assign ward to supervisor (ADMIN/SUPERADMIN only)
router.post(
  '/assign-supervisor',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  wardController.assignWardToSupervisor
);

// Bulk ward assignment (ADMIN/SUPERADMIN only)
router.post(
  '/bulk-assign',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  wardController.bulkWardAssignment
);

// Update ward assignment status (ADMIN/SUPERADMIN/SUPERVISOR)
router.put(
  '/update-assignment',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN', 'SUPERVISOR']),
  wardController.updateWardAssignment
);

// ========================================
// ACCESS CONTROL ROUTES
// ========================================

// Toggle surveyor access (SUPERVISOR/ADMIN/SUPERADMIN)
router.put(
  '/toggle-access',
  authenticateJWT,
  restrictToRoles(['SUPERVISOR', 'ADMIN', 'SUPERADMIN']),
  wardController.toggleSurveyorAccess
);

// ========================================
// SUPERVISOR MANAGEMENT ROUTES
// ========================================

// Assign supervisor to ward (ADMIN/SUPERADMIN only)
router.post(
  '/assign-supervisor-to-ward',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  wardController.assignSupervisorToWard
);

// Remove supervisor from ward (ADMIN/SUPERADMIN only)
router.delete(
  '/remove-supervisor-from-ward',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  wardController.removeSupervisorFromWard
);

// ========================================
// WARD STATUS ROUTES
// ========================================

// Update ward status (ADMIN/SUPERADMIN only)
router.put(
  '/update-status',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  wardController.updateWardStatus
);

// ========================================
// QUERY ROUTES (All authenticated users)
// ========================================

// Get ward assignments (filtered by role)
router.get(
  '/assignments',
  authenticateJWT,
  wardController.getWardAssignments
);

// Get available wards for dropdowns
router.get(
  '/available-wards',
  authenticateJWT,
  wardController.getAvailableWards
);

// Get available mohallas for dropdowns
router.get(
  '/available-mohallas',
  authenticateJWT,
  wardController.getAvailableMohallas
);

// Get ward-mohalla mappings
router.get(
  '/ward-mohalla-mappings',
  authenticateJWT,
  wardController.getWardMohallaMappings
);

// Get surveyors by ward
router.get(
  '/surveyors/:wardId',
  authenticateJWT,
  wardController.getSurveyorsByWard
);

// Get supervisors by ward
router.get(
  '/supervisors/:wardId',
  authenticateJWT,
  wardController.getSupervisorsByWard
);

export default router; 