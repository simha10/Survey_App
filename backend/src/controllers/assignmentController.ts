import { Request, Response } from 'express';
import * as assignmentService from '../services/assignmentService';

// Bulk assign users to wards/mohallas
export const bulkAssign = async (req: Request, res: Response) => {
  try {
    // Get the user ID from the JWT token
    const assignedById = (req as any).user?.userId;
    if (!assignedById) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Add the assignedById to the request body
    const assignmentData = {
      ...req.body,
      assignedById
    };
    
    const result = await assignmentService.bulkAssign(assignmentData);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get all assignments for a user
export const getAssignmentsByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const result = await assignmentService.getAssignmentsByUser(userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get all assignments for a ward
export const getAssignmentsByWard = async (req: Request, res: Response) => {
  try {
    const wardId = req.params.wardId;
    const result = await assignmentService.getAssignmentsByWard(wardId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}; 