import express from 'express';
import { authenticateJWT, restrictToRoles } from '../middleware/authMiddleware';
import { 
  getAllMohallas, 
  getMohallasByWard, 
  getMohallaById, 
  createMohalla, 
  updateMohalla, 
  deleteMohalla, 
  updateMohallaStatus,
  searchMohallas
} from '../controllers/mohallaController';

const router = express.Router();

// Get all mohallas
router.get('/', authenticateJWT, getAllMohallas);

// Search mohallas by name (must come before /:mohallaId)
router.get('/search', authenticateJWT, searchMohallas);

// Get mohallas by ward
router.get('/ward/:wardId', authenticateJWT, getMohallasByWard);

// Get mohalla by ID
router.get('/:mohallaId', authenticateJWT, getMohallaById);

// Create mohalla (ADMIN/SUPERADMIN only)
router.post('/', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), createMohalla);

// Update mohalla (ADMIN/SUPERADMIN only)
router.put('/:mohallaId', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), updateMohalla);

// Delete mohalla (ADMIN/SUPERADMIN only)
router.delete('/:mohallaId', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), deleteMohalla);

// Update mohalla status (ADMIN/SUPERADMIN only)
router.put('/:mohallaId/status', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), updateMohallaStatus);

export default router; 