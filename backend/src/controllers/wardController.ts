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
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

// 7. Update Ward Status (DEPRECATED, use updateWardAndMohallasStatus)
// export const updateWardStatus = ... (leave as is, but add a comment to not use)

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
    const wards = await prisma.wardMaster.findMany({
      where: { isActive: true },
      select: {
        wardId: true,
        newWardNumber: true,
        wardName: true,
        description: true,
      },
      orderBy: { newWardNumber: 'asc' },
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
    const mappings = await prisma.wardMohallaMapping.findMany({
      where: { isActive: true },
      include: {
        ward: {
          select: {
            wardId: true,
            newWardNumber: true,
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
        { ward: { newWardNumber: 'asc' } },
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

export const getAllWards = async (req: Request, res: Response) => {
  try {
    const wards = await prisma.wardMaster.findMany({
      select: {
        wardId: true,
        newWardNumber: true,
        wardName: true,
        isActive: true,
        description: true,
      },
      orderBy: { newWardNumber: 'asc' },
    });
    res.json(wards);
  } catch (error) {
    console.error('Error fetching wards:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all possible ward statuses
export const getWardStatuses = async (req: Request, res: Response) => {
  try {
    const statuses = await prisma.wardStatusMaster.findMany({
      where: { isActive: true },
      select: {
        wardStatusId: true,
        statusName: true,
        isActive: true,
        description: true,
      },
      orderBy: { statusName: 'asc' },
    });
    res.json(statuses);
  } catch (error) {
    console.error('Error fetching ward statuses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getWardById = async (req: Request, res: Response) => {
  try {
    const { wardId } = req.params;
    const ward = await prisma.wardMaster.findUnique({
      where: { wardId },
      select: {
        wardId: true,
        newWardNumber: true,
        wardName: true,
        isActive: true,
        description: true,
      },
    });
    
    if (!ward) {
      return res.status(404).json({ message: 'Ward not found' });
    }
    
    res.json(ward);
  } catch (error) {
    console.error('Error fetching ward:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createWard = async (req: Request, res: Response) => {
  try {
    const { newWardNumber, wardName, description } = req.body;
    
    if (!newWardNumber || !wardName) {
      return res.status(400).json({ message: 'Ward number and name are required' });
    }
    
    const ward = await prisma.wardMaster.create({
      data: {
        newWardNumber,
        wardName,
        description,
        isActive: true,
      },
      select: {
        wardId: true,
        newWardNumber: true,
        wardName: true,
        isActive: true,
        description: true,
      },
    });
    
    res.status(201).json(ward);
  } catch (error) {
    console.error('Error creating ward:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateWard = async (req: Request, res: Response) => {
  try {
    const { wardId } = req.params;
    const { newWardNumber, wardName, description, isActive } = req.body;
    
    const ward = await prisma.wardMaster.update({
      where: { wardId },
      data: {
        newWardNumber,
        wardName,
        description,
        isActive,
      },
      select: {
        wardId: true,
        newWardNumber: true,
        wardName: true,
        isActive: true,
        description: true,
      },
    });
    
    res.json(ward);
  } catch (error) {
    console.error('Error updating ward:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteWard = async (req: Request, res: Response) => {
  try {
    const { wardId } = req.params;
    
    await prisma.wardMaster.update({
      where: { wardId },
      data: { isActive: false },
    });
    
    res.json({ message: 'Ward deleted successfully' });
  } catch (error) {
    console.error('Error deleting ward:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getWardsByZone = async (req: Request, res: Response) => {
  try {
    const { zoneId } = req.params;
    const mappings = await prisma.zoneWardMapping.findMany({
      where: { zoneId, isActive: true },
      include: {
        ward: {
          select: {
            wardId: true,
            newWardNumber: true,
            wardName: true,
            isActive: true,
            description: true,
            wardStatusMaps: {
              where: { isActive: true },
              include: {
                status: {
                  select: {
                    wardStatusId: true,
                    statusName: true,
                    description: true
                  }
                }
              }
            }
          },
        },
      },
      orderBy: {
        ward: { newWardNumber: 'asc' },
      },
    });
    const wards = mappings.map((m: any) => m.ward);
    res.json(wards);
  } catch (error) {
    console.error('Error fetching wards by zone:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllWardStatuses = async (req: Request, res: Response) => {
  try {
    const statuses = await prisma.wardStatusMaster.findMany({
      where: { isActive: true },
      select: {
        wardStatusId: true,
        statusName: true,
        isActive: true,
        description: true,
      },
      orderBy: { statusName: 'asc' },
    });
    res.json(statuses);
  } catch (error) {
    console.error('Error fetching ward statuses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update status for a ward (mohallas inherit status from ward)
export const updateWardStatus = async (req: Request, res: Response) => {
  let wardId: string = '';
  let wardStatusId: number = 0;
  let userId: string = '';
  
  try {
    wardId = req.params.wardId;
    wardStatusId = req.body.wardStatusId;
    userId = (req as any).user?.userId;

    if (!wardId || !wardStatusId || !userId) {
      return res.status(400).json({ error: 'wardId, wardStatusId, and userId are required' });
    }

    // Validate existence
    const ward = await prisma.wardMaster.findUnique({ where: { wardId } });
    if (!ward) return res.status(404).json({ error: 'Ward not found' });

    const status = await prisma.wardStatusMaster.findUnique({ where: { wardStatusId } });
    if (!status) return res.status(404).json({ error: 'Status not found' });

    // Check if a mapping already exists for this ward-status combination
    const existingMapping = await prisma.wardStatusMapping.findFirst({
      where: { 
        wardId, 
        wardStatusId 
      }
    });

    // Deactivate all previous status mappings for this ward
    await prisma.wardStatusMapping.updateMany({ 
      where: { wardId }, 
      data: { isActive: false } 
    });

    if (existingMapping) {
      // Update existing mapping to active
      await prisma.wardStatusMapping.update({
        where: { mappingId: existingMapping.mappingId },
        data: { 
          isActive: true,
          changedById: userId
        }
      });
    } else {
      // Create new status mapping for the ward
      await prisma.wardStatusMapping.create({
        data: {
          wardId,
          wardStatusId,
          changedById: userId,
          isActive: true,
        },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'WARD_STATUS_UPDATE',
        old_value: null, // Optionally fetch previous status
        new_value: `wardId:${wardId},wardStatusId:${wardStatusId}`,
      },
    });

    res.json({ 
      message: 'Ward status updated successfully. Mohallas will inherit this status.',
      wardId,
      newStatus: status.statusName
    });
  } catch (error: any) {
    console.error('Error updating ward status:', error);
    console.error('Error details:', {
      wardId: wardId,
      wardStatusId: wardStatusId,
      userId: userId,
      errorMessage: error?.message,
      errorCode: error?.code,
      errorMeta: error?.meta
    });
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search wards by name
export const searchWards = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    
    if (!search || typeof search !== 'string') {
      return res.status(400).json({ error: 'Search parameter is required' });
    }

    const wards = await prisma.wardMaster.findMany({
      where: {
        isActive: true,
        wardName: {
          contains: search,
          mode: 'insensitive'
        }
      },
      select: {
        wardId: true,
        newWardNumber: true,
        wardName: true,
        isActive: true,
        description: true,
        wardStatusMaps: {
          where: { isActive: true },
          include: {
            status: {
              select: {
                wardStatusId: true,
                statusName: true,
                description: true
              }
            }
          }
        }
      },
      orderBy: { newWardNumber: 'asc' },
    });

    res.json(wards);
  } catch (error) {
    console.error('Error searching wards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get wards with status information
export const getAllWardsWithStatus = async (req: Request, res: Response) => {
  try {
    const wards = await prisma.wardMaster.findMany({
      select: {
        wardId: true,
        newWardNumber: true,
        wardName: true,
        isActive: true,
        description: true,
        wardStatusMaps: {
          where: { isActive: true },
          include: {
            status: {
              select: {
                wardStatusId: true,
                statusName: true,
                description: true
              }
            }
          }
        }
      },
      orderBy: { newWardNumber: 'asc' },
    });
    res.json(wards);
  } catch (error) {
    console.error('Error fetching wards with status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get wards by zone with status filtering
export const getWardsByZoneWithStatus = async (req: Request, res: Response) => {
  try {
    const { zoneId } = req.params;
    const { status } = req.query;
    
    const mappings = await prisma.zoneWardMapping.findMany({
      where: { zoneId, isActive: true },
      include: {
        ward: {
          select: {
            wardId: true,
            newWardNumber: true,
            wardName: true,
            isActive: true,
            description: true,
            wardStatusMaps: {
              where: { isActive: true },
              include: {
                status: {
                  select: {
                    wardStatusId: true,
                    statusName: true,
                    description: true
                  }
                }
              }
            }
          },
        },
      },
      orderBy: {
        ward: { newWardNumber: 'asc' },
      },
    });
    
    let wards = mappings.map((m: any) => m.ward);
    
    // Filter by status if provided
    if (status && typeof status === 'string') {
      wards = wards.filter((ward: any) => 
        ward.wardStatusMaps && 
        ward.wardStatusMaps.length > 0 && 
        ward.wardStatusMaps[0].status.statusName === status
      );
    }
    
    res.json(wards);
  } catch (error) {
    console.error('Error fetching wards by zone with status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 