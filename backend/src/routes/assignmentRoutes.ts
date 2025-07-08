import { Router } from 'express';
import * as assignmentController from '../controllers/assignmentController';

const router = Router();

// Bulk assignment
router.post('/bulk', assignmentController.bulkAssign);

// Get assignments by user
router.get('/user/:userId', assignmentController.getAssignmentsByUser);

// Get assignments by ward
router.get('/ward/:wardId', assignmentController.getAssignmentsByWard);

// Update isActive for an assignment
router.patch('/:assignmentId/status', assignmentController.updateAssignmentStatus);

// Delete an assignment
router.delete('/:assignmentId', assignmentController.deleteAssignment);

// Get all assignments (admin view)
router.get('/', assignmentController.getAllAssignments);

export default router; 