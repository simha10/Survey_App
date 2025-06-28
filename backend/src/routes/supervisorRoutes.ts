import { Router } from 'express';
import { supervisorDashboard } from '../controllers/supervisorController';
import { authenticateJWT, restrictToRoles } from '../middleware/authMiddleware';

const router = Router();

router.get('/dashboard', authenticateJWT, restrictToRoles(['SUPERVISOR']), supervisorDashboard);

export default router; 