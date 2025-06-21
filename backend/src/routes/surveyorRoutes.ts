import { Router } from 'express';
import * as surveyorController from '../controllers/surveyorController';
import { authenticateJWT, restrictToRoles, restrictToSurveyor } from '../middleware/authMiddleware';

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

export default router;