import { Router } from 'express';
import { authenticateJWT, restrictToRoles } from '../middleware/authMiddleware';
import * as qcController from '../controllers/qcController';

const router = Router();

// QC Routes - Placeholder implementations
router.post('/create', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), (req, res) => {
  res.status(501).json({ error: 'QC functionality not implemented yet' });
});

router.put('/:qcRecordId', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), (req, res) => {
  res.status(501).json({ error: 'QC functionality not implemented yet' });
});

router.get('/pending', authenticateJWT, (req, res) => {
  res.status(501).json({ error: 'QC functionality not implemented yet' });
});

router.get('/stats', authenticateJWT, qcController.getQCStats);

router.post('/bulk-approve', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), (req, res) => {
  res.status(501).json({ error: 'QC functionality not implemented yet' });
});

router.post('/bulk-reject', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), (req, res) => {
  res.status(501).json({ error: 'QC functionality not implemented yet' });
});

router.get('/survey/:surveyUniqueCode', authenticateJWT, (req, res) => {
  res.status(501).json({ error: 'QC functionality not implemented yet' });
});

router.get('/user/:userId', authenticateJWT, (req, res) => {
  res.status(501).json({ error: 'QC functionality not implemented yet' });
});

// Property list for QC (with filters/search)
router.get('/property-list', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), qcController.getPropertyList);

// Single QC update (edit + approve/reject)
router.put('/survey/:surveyUniqueCode', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), qcController.updateSurveyQC);

// Bulk QC approve/reject
router.post('/bulk-qc', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), qcController.bulkQCAction);

// QC history for a survey
router.get('/history/:surveyUniqueCode', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), qcController.getQCHistory);

// Full property details for QC edit page
router.get('/property/:surveyUniqueCode', authenticateJWT, restrictToRoles(['SUPERADMIN', 'ADMIN']), qcController.getFullPropertyDetails);

export default router; 