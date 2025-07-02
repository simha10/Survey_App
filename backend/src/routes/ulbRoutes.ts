import express from 'express';
import { authenticateJWT, restrictToRoles } from '../middleware/authMiddleware';
import { 
  getAllUlbs, 
  getUlbById, 
  createUlb, 
  updateUlb, 
  deleteUlb 
} from '../controllers/ulbController';

const router = express.Router();

// Get all ULBs
router.get('/', authenticateJWT, getAllUlbs);

// Get ULB by ID
router.get('/:ulbId', authenticateJWT, getUlbById);

// Create ULB (ADMIN/SUPERADMIN only)
router.post('/', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), createUlb);

// Update ULB (ADMIN/SUPERADMIN only)
router.put('/:ulbId', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), updateUlb);

// Delete ULB (ADMIN/SUPERADMIN only)
router.delete('/:ulbId', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), deleteUlb);

export default router; 