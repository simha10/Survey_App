import { Request, Response } from 'express';
import { getSupervisorDashboard } from '../services/supervisorService';

export const supervisorDashboard = async (req: Request, res: Response) => {
  try {
    const supervisorId = (req as any).user.userId;
    const result = await getSupervisorDashboard(supervisorId);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 