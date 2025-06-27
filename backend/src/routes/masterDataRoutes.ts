import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Placeholder routes - can be implemented later
router.get('/property-types', authenticateJWT, (req, res) => {
  res.json({ message: 'Property types endpoint - to be implemented' });
});

router.get('/construction-types', authenticateJWT, (req, res) => {
  res.json({ message: 'Construction types endpoint - to be implemented' });
});

router.get('/occupancy-statuses', authenticateJWT, (req, res) => {
  res.json({ message: 'Occupancy statuses endpoint - to be implemented' });
});

export default router; 