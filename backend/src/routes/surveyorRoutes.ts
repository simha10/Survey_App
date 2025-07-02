import { Router } from 'express';
import * as surveyorController from '../controllers/surveyorController';
import { authenticateJWT, restrictToRoles, restrictToSurveyor } from '../middleware/authMiddleware';
import { getMyAssignments } from '../controllers/surveyorController';

const router = Router();

router.post(
  '/assign-ward',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  surveyorController.assignWard
);

router.post(
  '/toggle-login',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN', 'SUPERVISOR']),
  restrictToSurveyor,
  surveyorController.toggleLogin
);

router.get('/my-assignments', authenticateJWT, restrictToRoles(['SURVEYOR']), getMyAssignments);

router.get('/assigned-mohallas', authenticateJWT, restrictToRoles(['SURVEYOR']), surveyorController.getAssignedMohallas);

export default router;