import { Router } from 'express';
import * as assignmentController from '../controllers/assignmentController';

const router = Router();

// Bulk assignment
router.post('/bulk', assignmentController.bulkAssign);

// Get assignments by user
router.get('/user/:userId', assignmentController.getAssignmentsByUser);

// Get assignments by ward
router.get('/ward/:wardId', assignmentController.getAssignmentsByWard);

export default router; 