import { Router } from 'express';
import * as wardController from '../controllers/wardController';
import { authenticateJWT, restrictToRoles } from '../middleware/authMiddleware';
import { 
  getAllWards, 
  getWardsByZone, 
  getAllWardStatuses,
  getWardById,
  createWard,
  updateWard,
  deleteWard,
  updateWardStatus,
  getWardStatuses,
  searchWards,
  getAllWardsWithStatus,
  getWardsByZoneWithStatus,
  debugWardStatus
} from '../controllers/wardController';

const router = Router();

// ========================================
// WARD MASTER DATA ROUTES
// ========================================

// Get all wards
router.get('/', authenticateJWT, getAllWards);

// Get all wards with status information
router.get('/with-status', authenticateJWT, getAllWardsWithStatus);

// Search wards by name (must come before /:wardId)
router.get('/search', authenticateJWT, searchWards);

// Get all ward statuses (must come before /:wardId)
router.get('/statuses', authenticateJWT, getAllWardStatuses);

// Get wards by zone (must come before /:wardId)
router.get('/zone/:zoneId', authenticateJWT, getWardsByZone);

// Get wards by zone with status filtering (must come before /:wardId)
router.get('/zone/:zoneId/with-status', authenticateJWT, getWardsByZoneWithStatus);

// Get ward assignments (must come before /:wardId)
router.get('/assignments', authenticateJWT, wardController.getWardAssignments);

// Get available wards for dropdowns (must come before /:wardId)
router.get('/available-wards', authenticateJWT, wardController.getAvailableWards);

// Get available mohallas for dropdowns (must come before /:wardId)
router.get('/available-mohallas', authenticateJWT, wardController.getAvailableMohallas);

// Get ward-mohalla mappings (must come before /:wardId)
router.get('/ward-mohalla-mappings', authenticateJWT, wardController.getWardMohallaMappings);

// Get surveyors by ward (must come before /:wardId)
router.get('/surveyors/:wardId', authenticateJWT, wardController.getSurveyorsByWard);

// Get supervisors by ward (must come before /:wardId)
router.get('/supervisors/:wardId', authenticateJWT, wardController.getSupervisorsByWard);

// Create ward (ADMIN/SUPERADMIN only)
router.post('/', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), createWard);

// Debug ward status (must come before /:wardId)
router.get('/debug/:wardId', authenticateJWT, wardController.debugWardStatus);

// Get ward by ID (must come after specific routes)
router.get('/:wardId', authenticateJWT, getWardById);

// Update ward (ADMIN/SUPERADMIN only)
router.put('/:wardId', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), updateWard);

// Delete ward (ADMIN/SUPERADMIN only)
router.delete('/:wardId', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), deleteWard);

// Update ward status (ADMIN/SUPERADMIN only)
router.put('/:wardId/status', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), wardController.updateWardStatus);

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

// Add these routes:
router.get('/statuses', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), wardController.getWardStatuses);

export default router; 