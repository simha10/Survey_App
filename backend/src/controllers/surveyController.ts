import { Request, Response } from 'express';
import { CreateSurveyDtoSchema } from '../dtos/surveyDto';
import * as surveyService from '../services/surveyService';
import { z } from 'zod';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    roles: string[];
  };
}

export const submitSurvey = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Log the incoming request body for debugging
    console.log('Received survey submission body:', JSON.stringify(req.body, null, 2));
    const surveyData = CreateSurveyDtoSchema.parse(req.body);
    const uploadedById = req.user?.userId;

    if (!uploadedById) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Optionally, enforce at least one floor-wise assessment if required
    // if (!surveyData.residentialPropertyAssessments?.length && !surveyData.nonResidentialPropertyAssessments?.length) {
    //   return res.status(400).json({ message: 'At least one floor-wise assessment is required.' });
    // }

    const newSurvey = await surveyService.createSurvey(surveyData, uploadedById);
    res.status(201).json(newSurvey);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Log the full Zod error details
      console.log('Zod validation error:', JSON.stringify(error.errors, null, 2));
      return res.status(400).json({ message: 'Invalid request body', errors: error.errors });
    }
    if (error instanceof Error) {
      let errors;
      try {
        errors = JSON.parse(error.message);
      } catch {
        errors = error.message;
      }
      // Log generic error
      console.log('Error submitting survey:', errors);
      return res.status(400).json({ message: 'Invalid request body', errors });
    }
    res.status(500).json({ message: 'Error submitting survey', error });
  }
}; 