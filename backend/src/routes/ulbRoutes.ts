import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { getAllUlbs } from '../controllers/ulbController';

const router = express.Router();

router.get('/', authenticateJWT, getAllUlbs);

export default router; 