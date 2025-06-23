import { Request, Response } from 'express';
import * as wardService from '../services/wardService';
import {
  AssignWardToSurveyorSchema,
  AssignWardToSupervisorSchema,
  UpdateWardAssignmentSchema,
  BulkWardAssignmentSchema,
  ToggleSurveyorAccessSchema,
  GetWardAssignmentsSchema,
  UpdateWardStatusSchema,
  AssignSupervisorToWardSchema,
  RemoveSupervisorFromWardSchema,
} from '../dtos/wardDto';

// 1. Assign Ward to Surveyor
export const assignWardToSurveyor = async (req: Request, res: Response) => {
  try {
    const parsed = AssignWardToSurveyorSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const assignedById = (req as any).user.userId;
    const result = await wardService.assignWardToSurveyor(parsed.data, assignedById);
    return res.status(201).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 2. Assign Ward to Supervisor
export const assignWardToSupervisor = async (req: Request, res: Response) => {
  try {
    const parsed = AssignWardToSupervisorSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const assignedById = (req as any).user.userId;
    const result = await wardService.assignWardToSupervisor(parsed.data, assignedById);
    return res.status(201).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 3. Bulk Ward Assignment
export const bulkWardAssignment = async (req: Request, res: Response) => {
  try {
    const parsed = BulkWardAssignmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const assignedById = (req as any).user.userId;
    const result = await wardService.bulkWardAssignment(parsed.data, assignedById);
    return res.status(201).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 4. Update Ward Assignment Status
export const updateWardAssignment = async (req: Request, res: Response) => {
  try {
    const parsed = UpdateWardAssignmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const updatedById = (req as any).user.userId;
    const result = await wardService.updateWardAssignment(parsed.data, updatedById);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 5. Toggle Surveyor Access
export const toggleSurveyorAccess = async (req: Request, res: Response) => {
  try {
    const parsed = ToggleSurveyorAccessSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const actionById = (req as any).user.userId;
    const result = await wardService.toggleSurveyorAccess(parsed.data, actionById);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 6. Get Ward Assignments
export const getWardAssignments = async (req: Request, res: Response) => {
  try {
    const parsed = GetWardAssignmentsSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    const result = await wardService.getWardAssignments(parsed.data);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 7. Update Ward Status
export const updateWardStatus = async (req: Request, res: Response) => {
  try {
    const parsed = UpdateWardStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const updatedById = (req as any).user.userId;
    const result = await wardService.updateWardStatus(parsed.data, updatedById);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 8. Assign Supervisor to Ward
export const assignSupervisorToWard = async (req: Request, res: Response) => {
  try {
    const parsed = AssignSupervisorToWardSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const assignedById = (req as any).user.userId;
    const result = await wardService.assignSupervisorToWard(parsed.data, assignedById);
    return res.status(201).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 9. Remove Supervisor from Ward
export const removeSupervisorFromWard = async (req: Request, res: Response) => {
  try {
    const parsed = RemoveSupervisorFromWardSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const removedById = (req as any).user.userId;
    const result = await wardService.removeSupervisorFromWard(parsed.data, removedById);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 10. Get Available Wards (for dropdowns)
export const getAvailableWards = async (req: Request, res: Response) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const wards = await prisma.wardMaster.findMany({
      where: { isActive: true },
      select: {
        wardId: true,
        wardNumber: true,
        wardName: true,
        description: true,
      },
      orderBy: { wardNumber: 'asc' },
    });

    return res.status(200).json({ wards });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 11. Get Available Mohallas (for dropdowns)
export const getAvailableMohallas = async (req: Request, res: Response) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const mohallas = await prisma.mohallaMaster.findMany({
      where: { isActive: true },
      select: {
        mohallaId: true,
        mohallaName: true,
        description: true,
      },
      orderBy: { mohallaName: 'asc' },
    });

    return res.status(200).json({ mohallas });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 12. Get Ward-Mohalla Mappings
export const getWardMohallaMappings = async (req: Request, res: Response) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const mappings = await prisma.wardMohallaMapping.findMany({
      where: { isActive: true },
      include: {
        ward: {
          select: {
            wardId: true,
            wardNumber: true,
            wardName: true,
          },
        },
        mohalla: {
          select: {
            mohallaId: true,
            mohallaName: true,
          },
        },
      },
      orderBy: [
        { ward: { wardNumber: 'asc' } },
        { mohalla: { mohallaName: 'asc' } },
      ],
    });

    return res.status(200).json({ mappings });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 13. Get Surveyors by Ward
export const getSurveyorsByWard = async (req: Request, res: Response) => {
  try {
    const { wardId } = req.params;
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const surveyors = await prisma.surveyorAssignment.findMany({
      where: { wardId, isActive: true },
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            mobileNumber: true,
          },
        },
        surveyor: {
          select: {
            surveyorName: true,
          },
        },
      },
    });

    return res.status(200).json({ surveyors });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 14. Get Supervisors by Ward
export const getSupervisorsByWard = async (req: Request, res: Response) => {
  try {
    const { wardId } = req.params;
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const supervisors = await prisma.supervisors.findMany({
      where: { wardId },
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            mobileNumber: true,
          },
        },
      },
    });

    return res.status(200).json({ supervisors });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 