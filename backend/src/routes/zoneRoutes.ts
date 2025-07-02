import express from 'express';
import { authenticateJWT, restrictToRoles } from '../middleware/authMiddleware';
import { 
  getAllZones, 
  getZonesByUlb, 
  getZoneById, 
  createZone, 
  updateZone, 
  deleteZone 
} from '../controllers/zoneController';

const router = express.Router();

// Get all zones
router.get('/', authenticateJWT, getAllZones);

// Get zones by ULB (must come before /:zoneId to avoid conflicts)
router.get('/ulb/:ulbId', authenticateJWT, getZonesByUlb);

// Create zone (ADMIN/SUPERADMIN only)
router.post('/', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), createZone);

// Get zone by ID (must come after specific routes)
router.get('/:zoneId', authenticateJWT, getZoneById);

// Update zone (ADMIN/SUPERADMIN only)
router.put('/:zoneId', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), updateZone);

// Delete zone (ADMIN/SUPERADMIN only)
router.delete('/:zoneId', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), deleteZone);

export default router; 