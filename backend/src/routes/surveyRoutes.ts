import { Router } from 'express';
import { submitSurvey } from '../controllers/surveyController';
import { authenticateJWT, restrictToRoles } from '../middleware/authMiddleware';

const router = Router();

router.post(
  '/addSurvey',
  authenticateJWT,
  restrictToRoles(['SURVEYOR', 'SUPERVISOR']),
  submitSurvey
);

export default router; 