import { Request, Response } from 'express';
import { CreateSurveyDtoSchema } from '../dtos/surveyDto';
import * as surveyService from '../services/surveyService';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    roles: string[];
  };
}

export const submitSurvey = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const surveyData = CreateSurveyDtoSchema.parse(req.body);
    const uploadedById = req.user?.userId;

    if (!uploadedById) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const newSurvey = await surveyService.createSurvey(surveyData, uploadedById);
    res.status(201).json(newSurvey);
  } catch (error) {
    if (error instanceof Error) {
        return res.status(400).json({ message: 'Invalid request body', errors: JSON.parse(error.message) });
    }
    res.status(500).json({ message: 'Error submitting survey', error });
  }
}; 