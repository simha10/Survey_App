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

// 10. Get Available Wards (for dropdowns) - Only wards with unassigned mohallas
// Debug endpoint to check specific ward status
export const debugWardStatus = async (req: Request, res: Response) => {
  try {
    const { wardId } = req.params;
    
    // Get ward details
    const ward = await prisma.wardMaster.findUnique({
      where: { wardId },
      include: {
        wardStatusMaps: {
          where: { isActive: true },
          include: {
            status: true
          }
        }
      }
    });

    if (!ward) {
      return res.status(404).json({ error: 'Ward not found' });
    }

    // Get zone mapping
    const zoneMapping = await prisma.zoneWardMapping.findFirst({
      where: { wardId, isActive: true },
      include: {
        zone: true
      }
    });

    // Get mohallas
    const mohallas = await prisma.wardMohallaMapping.findMany({
      where: { wardId, isActive: true },
      include: {
        mohalla: true
      }
    });

    // Get assignments
    const assignments = await prisma.surveyorAssignment.findMany({
      where: { wardId, isActive: true },
      include: {
        user: true
      }
    });

    const assignedMohallaIds = new Set(
      assignments.flatMap((a) => a.mohallaIds)
    );

    const debugInfo = {
      ward: {
        wardId: ward.wardId,
        wardName: ward.wardName,
        newWardNumber: ward.newWardNumber,
        isActive: ward.isActive
      },
      zone: zoneMapping?.zone || null,
      status: ward.wardStatusMaps.map(sm => sm.status.statusName),
      hasStartedStatus: ward.wardStatusMaps.some(sm => sm.status.statusName === 'STARTED'),
      mohallas: {
        total: mohallas.length,
        list: mohallas.map(m => ({
          mohallaId: m.mohalla.mohallaId,
          mohallaName: m.mohalla.mohallaName,
          isAssigned: assignedMohallaIds.has(m.mohalla.mohallaId)
        }))
      },
      assignments: assignments.map(a => ({
        userId: a.userId,
        userName: a.user.name || a.user.username,
        mohallaIds: a.mohallaIds,
        isActive: a.isActive
      })),
      assignedMohallas: assignments.flatMap(a => a.mohallaIds).length,
      unassignedMohallas: mohallas.length - assignments.flatMap(a => a.mohallaIds).length,
      shouldBeAvailable: ward.wardStatusMaps.some(sm => sm.status.statusName === 'STARTED') && 
                        (mohallas.length - assignments.flatMap(a => a.mohallaIds).length) > 0
    };

    return res.status(200).json(debugInfo);
  } catch (error: any) {
    console.error('Error in debugWardStatus:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAvailableWards = async (req: Request, res: Response) => {
  try {
    const { zoneId } = req.query;

    console.log('=== DEBUG: getAvailableWards ===');
    console.log('Received zoneId:', zoneId);
    console.log('zoneId type:', typeof zoneId);
    console.log('zoneId truthy:', !!zoneId);

    // If zoneId is provided, get wards from zone mappings that exist in WardMaster
    let wards: any[] = [];
    if (zoneId && typeof zoneId === 'string') {
      // Get zone-ward mappings with ward details
      const zoneWardMappings = await prisma.zoneWardMapping.findMany({
        where: { zoneId, isActive: true },
        include: {
          ward: {
            select: {
              wardId: true,
              newWardNumber: true,
              wardName: true,
              description: true,
              wardStatusMaps: {
                where: { isActive: true },
                include: {
                  status: {
                    select: {
                      wardStatusId: true,
                      statusName: true,
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { ward: { newWardNumber: 'asc' } },
      });

      console.log('Zone-ward mappings found:', zoneWardMappings.length);
      console.log('Zone-ward mappings with wards:', zoneWardMappings.map(m => ({
        wardId: m.wardId,
        ward: m.ward ? { wardId: m.ward.wardId, wardName: m.ward.wardName } : null
      })));

      // Filter out mappings where ward doesn't exist
      wards = zoneWardMappings
        .filter(mapping => mapping.ward !== null)
        .map(mapping => mapping.ward);

      console.log('Wards after filtering existing ones:', wards.length);
    } else {
      console.log('No zoneId provided, fetching all active wards');
      // If no zone specified, get all active wards
      wards = await prisma.wardMaster.findMany({
        where: { isActive: true },
        select: {
          wardId: true,
          newWardNumber: true,
          wardName: true,
          description: true,
          wardStatusMaps: {
            where: { isActive: true },
            include: {
              status: {
                select: {
                  wardStatusId: true,
                  statusName: true,
                }
              }
            }
          }
        },
        orderBy: { newWardNumber: 'asc' },
      });
    }

    console.log('Wards fetched from DB:', wards.length);
    console.log('Wards sample:', wards.slice(0, 3).map((w: any) => ({
      wardId: w.wardId,
      wardName: w.wardName,
      statusCount: w.wardStatusMaps.length,
      statuses: w.wardStatusMaps.map((sm: any) => sm.status.statusName)
    })));

    // For each ward, calculate unassigned mohallas
    const wardsWithStatus = await Promise.all(
      wards.map(async (ward) => {
        console.log(`Processing ward: ${ward.wardName} (${ward.wardId})`);

        // Check if ward has STARTED status
        const hasStartedStatus = ward.wardStatusMaps.some(
          (statusMap: any) => statusMap.status.statusName === 'STARTED'
        );

        console.log(`  Ward ${ward.wardName} has STARTED status: ${hasStartedStatus}`);

        // If ward doesn't have STARTED status, skip it
        if (!hasStartedStatus) {
          console.log(`  Skipping ward ${ward.wardName} - no STARTED status`);
          return null;
        }

        // Get all mohallas in this ward
        const allMohallas = await prisma.wardMohallaMapping.findMany({
          where: { wardId: ward.wardId, isActive: true },
          select: { mohallaId: true },
        });

        console.log(`  Ward ${ward.wardName} has ${allMohallas.length} total mohallas`);

        // Get assigned mohallas for this ward
        const assignments = await prisma.surveyorAssignment.findMany({
          where: { wardId: ward.wardId, isActive: true },
          select: { mohallaIds: true },
        });

        console.log(`  Ward ${ward.wardName} has ${assignments.length} assignments`);

        const assignedMohallaIds = new Set(
          assignments.flatMap((a) => a.mohallaIds)
        );

        console.log(`  Ward ${ward.wardName} has ${assignedMohallaIds.size} assigned mohalla IDs`);

        const totalMohallas = allMohallas.length;
        const assignedMohallas = allMohallas.filter((m) =>
          assignedMohallaIds.has(m.mohallaId)
        ).length;
        const unassignedMohallas = totalMohallas - assignedMohallas;

        console.log(`  Ward ${ward.wardName} - Total: ${totalMohallas}, Assigned: ${assignedMohallas}, Unassigned: ${unassignedMohallas}`);

        return {
          ...ward,
          totalMohallas,
          assignedMohallas,
          unassignedMohallas,
        };
      })
    );

    // Filter out null values and only include wards with at least one unassigned mohalla
    const availableWards = wardsWithStatus.filter(
      (ward) => ward !== null && ward.unassignedMohallas > 0
    );

    console.log(`Found ${availableWards.length} available wards for zone ${zoneId}`);
    availableWards.forEach(ward => {
      if (ward) {
        console.log(`Ward: ${ward.wardName}, Unassigned: ${ward.unassignedMohallas}/${ward.totalMohallas}`);
      }
    });

    return res.status(200).json({ wards: availableWards });
  } catch (error: any) {
    console.error('Error in getAvailableWards:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 11. Get Available Mohallas (for dropdowns) - Only unassigned mohallas for a specific ward
export const getAvailableMohallas = async (req: Request, res: Response) => {
  try {
    const { wardId } = req.query;

    if (wardId && typeof wardId === 'string') {
      // Get unassigned mohallas for specific ward
      const wardMohallas = await prisma.wardMohallaMapping.findMany({
        where: { wardId, isActive: true },
        include: {
          mohalla: {
            select: {
              mohallaId: true,
              mohallaName: true,
              description: true,
            },
          },
        },
      });

      // Get assigned mohallas for this ward
      const assignments = await prisma.surveyorAssignment.findMany({
        where: { wardId, isActive: true },
        select: { mohallaIds: true, user: { select: { name: true, username: true } } },
      });

      const assignedMohallaIds = new Set(
        assignments.flatMap((a) => a.mohallaIds)
      );

      // Create assignment map for UI display
      const assignmentMap = new Map();
      assignments.forEach((assignment) => {
        assignment.mohallaIds.forEach((mohallaId) => {
          assignmentMap.set(mohallaId, assignment.user);
        });
      });

      const mohallasWithStatus = wardMohallas.map((wm) => ({
        ...wm.mohalla,
        isAssigned: assignedMohallaIds.has(wm.mohalla.mohallaId),
        assignedTo: assignmentMap.get(wm.mohalla.mohallaId) || null,
      }));

      return res.status(200).json({ mohallas: mohallasWithStatus });
    } else {
      // Get all mohallas if no ward specified
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
    }
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
    });
    
    if (!ward) {
      return res.status(404).json({ message: 'Ward not found' });
    }

    // Get zone information for this ward
    const zoneMapping = await prisma.zoneWardMapping.findFirst({
      where: { wardId, isActive: true },
      include: {
        zone: {
          select: {
            zoneId: true,
            zoneName: true,
            zoneNumber: true,
            description: true
          }
        }
      }
    });

    const wardWithZone = {
      ...ward,
      zone: zoneMapping?.zone || null
    };
    
    res.json(wardWithZone);
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
  try {
    const parsed = UpdateWardStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const { wardId, wardStatusId } = parsed.data;
    const userId = (req as any).user?.userId;

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