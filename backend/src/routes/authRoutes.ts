import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticateJWT, restrictToRoles } from '../middleware/authMiddleware';


const router = Router();

router.post('/login', authController.login);

router.post(
  '/register',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  authController.register
);

export default router;