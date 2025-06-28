import { Request, Response } from 'express';
import * as surveyorService from '../services/surveyorService';
import { 
  AssignWardSchema, 
  ToggleLoginSchema, 
  RemoveWardAssignmentSchema,
  GetSurveyorAssignmentsSchema 
} from '../dtos/surveyorDto';

export const assignWard = async (req: Request, res: Response) => {
  try {
    const parsed = AssignWardSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
    const assignedById = (req as any).user.userId;
    const result = await surveyorService.assignWard(parsed.data, assignedById);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleLogin = async (req: Request, res: Response) => {
  try {
    const parsed = ToggleLoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
    const result = await surveyorService.toggleLogin(parsed.data);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSurveyorAssignments = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await surveyorService.getSurveyorAssignments(userId);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeWardAssignment = async (req: Request, res: Response) => {
  try {
    const parsed = RemoveWardAssignmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
    const removedById = (req as any).user.userId;
    const result = await surveyorService.removeWardAssignment(parsed.data.assignmentId, removedById);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSurveyorProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await surveyorService.getSurveyorProfile(userId);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyAssignments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const result = await surveyorService.getSurveyorAssignments(userId);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};