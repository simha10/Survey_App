import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { getAllMohallas, getMohallasByWard } from '../controllers/mohallaController';

const router = express.Router();

router.get('/', authenticateJWT, getAllMohallas);
router.get('/ward/:wardId', authenticateJWT, getMohallasByWard);

export default router; 