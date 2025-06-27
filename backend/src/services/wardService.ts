import { PrismaClient } from '@prisma/client';
import {
  AssignWardToSurveyorDto,
  AssignWardToSupervisorDto,
  UpdateWardAssignmentDto,
  BulkWardAssignmentDto,
  ToggleSurveyorAccessDto,
  GetWardAssignmentsDto,
  UpdateWardStatusDto,
  AssignSupervisorToWardDto,
  RemoveSupervisorFromWardDto,
} from '../dtos/wardDto';

const prisma = new PrismaClient();

// Helper function to validate user role
async function validateUserRole(userId: string, expectedRole: string) {
  const mapping = await prisma.userRoleMapping.findFirst({
    where: { userId, isActive: true },
    include: { role: true },
  });
  if (!mapping || mapping.role.roleName !== expectedRole) {
    throw { status: 400, message: `Invalid ${expectedRole.toLowerCase()}` };
  }
  return mapping;
}

// Helper function to validate ward and related entities
async function validateWardEntities(wardId: string, mohallaId: string, wardMohallaMapId: string, zoneWardMapId: string, ulbZoneMapId: string) {
  const [ward, mohalla, wardMohalla, zoneWard, ulbZone] = await Promise.all([
    prisma.wardMaster.findUnique({ where: { wardId } }),
    prisma.mohallaMaster.findUnique({ where: { mohallaId } }),
    prisma.wardMohallaMapping.findUnique({ where: { wardMohallaMapId } }),
    prisma.zoneWardMapping.findUnique({ where: { zoneWardMapId } }),
    prisma.ulbZoneMapping.findUnique({ where: { ulbZoneMapId } }),
  ]);

  if (!ward || !mohalla || !wardMohalla || !zoneWard || !ulbZone) {
    throw { status: 400, message: 'Invalid ward/mohalla/zone/ulb mapping' };
  }

  return { ward, mohalla, wardMohalla, zoneWard, ulbZone };
}

// 1. Assign Ward to Surveyor
export async function assignWardToSurveyor(dto: AssignWardToSurveyorDto, assignedById: string) {
  const { surveyorId, wardId, mohallaId, wardMohallaMapId, zoneWardMapId, ulbZoneMapId, assignmentType, supervisorId } = dto;

  try {
    // Validate surveyor
    await validateUserRole(surveyorId, 'SURVEYOR');

    // Validate ward entities
    const { ward } = await validateWardEntities(wardId, mohallaId, wardMohallaMapId, zoneWardMapId, ulbZoneMapId);

    // Validate supervisor if provided
    if (supervisorId) {
      await validateUserRole(supervisorId, 'SUPERVISOR');
    }

    // Check for existing assignment
    const existingAssignment = await prisma.surveyorAssignment.findFirst({
      where: { userId: surveyorId, wardId, mohallaId, isActive: true },
    });

    if (existingAssignment) {
      throw { status: 409, message: 'Surveyor already assigned to this ward-mohalla combination' };
    }

    // Create assignment
    const result = await prisma.$transaction(async (tx) => {
      // Update surveyor's ward information
      await tx.surveyors.update({
        where: { userId: surveyorId },
        data: {
          wardNumber: ward.wardNumber,
          wardMohallaMapId,
          zoneWardMapId,
          ulbZoneMapId,
        },
      });

      // Create assignment record
      const assignment = await tx.surveyorAssignment.create({
        data: {
          userId: surveyorId,
          assignmentType,
          wardId,
          mohallaId,
          wardMohallaMapId,
          assignedById,
          isActive: true,
        },
      });

      // If supervisor is provided, ensure supervisor is assigned to this ward
      if (supervisorId) {
        const supervisorAssignment = await tx.supervisors.findFirst({
          where: { userId: supervisorId, wardId },
        });

        if (!supervisorAssignment) {
          await tx.supervisors.update({
            where: { userId: supervisorId },
            data: { wardId },
          });
        }
      }

      if (surveyorId) {
        await prisma.auditLog.create({
          data: {
            userId: surveyorId,
            action: 'ASSIGN_WARD_TO_SURVEYOR',
            old_value: existingAssignment ? JSON.stringify(existingAssignment) : null,
            new_value: JSON.stringify(assignment),
          }
        });
      }

      return assignment;
    });

    return {
      assignmentId: result.assignmentId,
      surveyorId,
      wardId,
      mohallaId,
      assignmentType,
      supervisorId,
      status: 'Assigned successfully',
    };
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}

// 2. Assign Ward to Supervisor
export async function assignWardToSupervisor(dto: AssignWardToSupervisorDto, assignedById: string) {
  const { supervisorId, wardIds, isActive } = dto;

  try {
    // Validate supervisor
    await validateUserRole(supervisorId, 'SUPERVISOR');

    // Validate all wards exist
    const wards = await prisma.wardMaster.findMany({
      where: { wardId: { in: wardIds } },
    });

    if (wards.length !== wardIds.length) {
      throw { status: 400, message: 'One or more wards not found' };
    }

    // Assign wards to supervisor
    const result = await prisma.$transaction(async (tx) => {
      const assignments = [];

      for (const wardId of wardIds) {
        // Check if supervisor is already assigned to this ward
        const existing = await tx.supervisors.findFirst({
          where: { userId: supervisorId, wardId },
        });

        if (!existing) {
          await tx.supervisors.update({
            where: { userId: supervisorId },
            data: { wardId },
          });
        }

        assignments.push({ supervisorId, wardId, isActive });
      }

      if (supervisorId) {
        await prisma.auditLog.create({
          data: {
            userId: supervisorId,
            action: 'ASSIGN_WARD_TO_SUPERVISOR',
            old_value: null,
            new_value: JSON.stringify(assignments),
          }
        });
      }

      return assignments;
    });

    return {
      supervisorId,
      assignedWards: result,
      status: 'Supervisor assigned to wards successfully',
    };
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}

// 3. Bulk Ward Assignment
export async function bulkWardAssignment(dto: BulkWardAssignmentDto, assignedById: string) {
  const { surveyorId, assignments, supervisorId } = dto;

  try {
    // Validate surveyor
    await validateUserRole(surveyorId, 'SURVEYOR');

    // Validate supervisor if provided
    if (supervisorId) {
      await validateUserRole(supervisorId, 'SUPERVISOR');
    }

    // Validate all ward entities
    for (const assignment of assignments) {
      await validateWardEntities(
        assignment.wardId,
        assignment.mohallaId,
        assignment.wardMohallaMapId,
        assignment.zoneWardMapId,
        assignment.ulbZoneMapId
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const createdAssignments = [];

      for (const assignment of assignments) {
        // Check for existing assignment
        const existing = await tx.surveyorAssignment.findFirst({
          where: { userId: surveyorId, wardId: assignment.wardId, mohallaId: assignment.mohallaId, isActive: true },
        });

        if (!existing) {
          const newAssignment = await tx.surveyorAssignment.create({
            data: {
              userId: surveyorId,
              assignmentType: assignment.assignmentType,
              wardId: assignment.wardId,
              mohallaId: assignment.mohallaId,
              wardMohallaMapId: assignment.wardMohallaMapId,
              assignedById,
              isActive: true,
            },
          });
          createdAssignments.push(newAssignment);
        }
      }

      // Update surveyor's primary ward info (use first assignment)
      if (assignments.length > 0) {
        const firstAssignment = assignments[0];
        const ward = await tx.wardMaster.findUnique({ where: { wardId: firstAssignment.wardId } });
        
        await tx.surveyors.update({
          where: { userId: surveyorId },
          data: {
            wardNumber: ward?.wardNumber,
            wardMohallaMapId: firstAssignment.wardMohallaMapId,
            zoneWardMapId: firstAssignment.zoneWardMapId,
            ulbZoneMapId: firstAssignment.ulbZoneMapId,
          },
        });
      }

      if (surveyorId) {
        await prisma.auditLog.create({
          data: {
            userId: surveyorId,
            action: 'BULK_WARD_ASSIGNMENT',
            old_value: null,
            new_value: JSON.stringify(createdAssignments),
          }
        });
      }

      return createdAssignments;
    });

    return {
      surveyorId,
      assignedWards: result.length,
      assignments: result,
      status: 'Bulk assignment completed successfully',
    };
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}

// 4. Update Ward Assignment Status
export async function updateWardAssignment(dto: UpdateWardAssignmentDto, updatedById: string) {
  const { assignmentId, isActive, reason } = dto;

  try {
    const assignment = await prisma.surveyorAssignment.findUnique({
      where: { assignmentId },
      include: { user: true, ward: true },
    });

    if (!assignment) {
      throw { status: 404, message: 'Assignment not found' };
    }

    const result = await prisma.surveyorAssignment.update({
      where: { assignmentId },
      data: { isActive },
    });

    if (updatedById) {
      await prisma.auditLog.create({
        data: {
          userId: updatedById,
          action: 'UPDATE_WARD_ASSIGNMENT',
          old_value: JSON.stringify(assignment),
          new_value: JSON.stringify(result),
        }
      });
    }

    return {
      assignmentId,
      surveyorId: assignment.userId,
      wardId: assignment.wardId,
      isActive,
      reason,
      status: 'Assignment updated successfully',
    };
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}

// 5. Toggle Surveyor Access (Supervisor/Admin/SuperAdmin can control)
export async function toggleSurveyorAccess(dto: ToggleSurveyorAccessDto, actionById: string) {
  const { surveyorId, wardId, isActive, reason, actionBy } = dto;

  try {
    // Validate surveyor
    await validateUserRole(surveyorId, 'SURVEYOR');

    // Validate action performer has appropriate role
    const actionPerformer = await prisma.userRoleMapping.findFirst({
      where: { userId: actionById, isActive: true },
      include: { role: true },
    });

    if (!actionPerformer) {
      throw { status: 401, message: 'Unauthorized action' };
    }

    // Check if action performer has permission
    const allowedRoles = ['SUPERADMIN', 'ADMIN'];
    if (actionBy === 'SUPERVISOR') {
      allowedRoles.push('SUPERVISOR');
    }

    if (!allowedRoles.includes(actionPerformer.role.roleName)) {
      throw { status: 403, message: 'Insufficient permissions' };
    }

    // If supervisor is performing action, validate they supervise the ward
    if (actionPerformer.role.roleName === 'SUPERVISOR' && wardId) {
      const supervisorWard = await prisma.supervisors.findFirst({
        where: { userId: actionById, wardId },
      });
      if (!supervisorWard) {
        throw { status: 403, message: 'Supervisor does not have authority over this ward' };
      }
    }

    // Update assignments
    const whereClause: any = { userId: surveyorId };
    if (wardId) {
      whereClause.wardId = wardId;
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update surveyor assignments
      await tx.surveyorAssignment.updateMany({
        where: whereClause,
        data: { isActive },
      });

      // If disabling all access, also update user status
      if (!isActive && !wardId) {
        await tx.usersMaster.update({
          where: { userId: surveyorId },
          data: { isActive: false },
        });
      }

      if (actionById) {
        await prisma.auditLog.create({
          data: {
            userId: actionById,
            action: 'TOGGLE_SURVEYOR_ACCESS',
            old_value: JSON.stringify({ surveyorId, wardId, isActive }),
            new_value: JSON.stringify({ surveyorId, wardId, isActive }),
          }
        });
      }

      return { surveyorId, wardId, isActive, actionBy, reason };
    });

    return {
      ...result,
      status: `Surveyor access ${isActive ? 'enabled' : 'disabled'} successfully`,
    };
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}

// 6. Get Ward Assignments
export async function getWardAssignments(dto: GetWardAssignmentsDto) {
  const { wardId, surveyorId, supervisorId, isActive } = dto;

  try {
    const whereClause: any = {};
    
    if (wardId) whereClause.wardId = wardId;
    if (surveyorId) whereClause.userId = surveyorId;
    if (isActive !== undefined) whereClause.isActive = isActive;

    const assignments = await prisma.surveyorAssignment.findMany({
      where: whereClause,
      include: {
        user: {
          include: {
            userRoleMaps: {
              where: { isActive: true },
              include: { role: true },
            },
          },
        },
        ward: true,
        mohalla: true,
        assignedBy: {
          include: {
            userRoleMaps: {
              where: { isActive: true },
              include: { role: true },
            },
          },
        },
      },
    });

    // Filter by supervisor if provided
    let filteredAssignments = assignments;
    if (supervisorId) {
      const supervisorWards = await prisma.supervisors.findMany({
        where: { userId: supervisorId },
        select: { wardId: true },
      });
      const supervisorWardIds = supervisorWards.map(sw => sw.wardId);
      filteredAssignments = assignments.filter(a => supervisorWardIds.includes(a.wardId));
    }

    if (surveyorId) {
      await prisma.auditLog.create({
        data: {
          userId: surveyorId,
          action: 'GET_WARD_ASSIGNMENTS',
          old_value: null,
          new_value: JSON.stringify({ assignments: filteredAssignments, total: filteredAssignments.length }),
        }
      });
    }

    return {
      assignments: filteredAssignments,
      total: filteredAssignments.length,
    };
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}

// 7. Update Ward Status
export async function updateWardStatus(dto: UpdateWardStatusDto, updatedById: string) {
  const { wardId, statusId, reason } = dto;

  try {
    // Validate ward and status exist
    const [ward, status] = await Promise.all([
      prisma.wardMaster.findUnique({ where: { wardId } }),
      prisma.wardStatusMaster.findUnique({ where: { statusId } }),
    ]);

    if (!ward || !status) {
      throw { status: 400, message: 'Invalid ward or status' };
    }

    const result = await prisma.wardStatusMapping.upsert({
      where: { wardId_statusId: { wardId, statusId } },
      update: { isActive: true, changedById: updatedById },
      create: {
        wardId,
        statusId,
        changedById: updatedById,
        isActive: true,
      },
    });

    if (updatedById) {
      await prisma.auditLog.create({
        data: {
          userId: updatedById,
          action: 'UPDATE_WARD_STATUS',
          old_value: JSON.stringify({ wardId, statusId, statusName: status.statusName }),
          new_value: JSON.stringify({ wardId, statusId, statusName: status.statusName }),
        }
      });
    }

    return {
      wardId,
      statusId,
      statusName: status.statusName,
      reason,
      status: 'Ward status updated successfully',
    };
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}

// 8. Assign Supervisor to Ward
export async function assignSupervisorToWard(dto: AssignSupervisorToWardDto, assignedById: string) {
  const { supervisorId, wardId, isActive } = dto;

  try {
    // Validate supervisor
    await validateUserRole(supervisorId, 'SUPERVISOR');

    // Validate ward
    const ward = await prisma.wardMaster.findUnique({ where: { wardId } });
    if (!ward) {
      throw { status: 400, message: 'Invalid ward' };
    }

    const result = await prisma.supervisors.update({
      where: { userId: supervisorId },
      data: { wardId },
    });

    if (supervisorId) {
      await prisma.auditLog.create({
        data: {
          userId: supervisorId,
          action: 'ASSIGN_SUPERVISOR_TO_WARD',
          old_value: null,
          new_value: JSON.stringify({ supervisorId, wardId, isActive }),
        }
      });
    }

    return {
      supervisorId,
      wardId,
      isActive,
      status: 'Supervisor assigned to ward successfully',
    };
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}

// 9. Remove Supervisor from Ward
export async function removeSupervisorFromWard(dto: RemoveSupervisorFromWardDto, removedById: string) {
  const { supervisorId, wardId, reason } = dto;

  try {
    // Validate supervisor
    await validateUserRole(supervisorId, 'SUPERVISOR');

    const supervisor = await prisma.supervisors.findFirst({
      where: { userId: supervisorId, wardId },
    });

    if (!supervisor) {
      throw { status: 404, message: 'Supervisor not assigned to this ward' };
    }

    // Check if supervisor has active surveyors in this ward
    const activeSurveyors = await prisma.surveyorAssignment.findMany({
      where: { wardId, isActive: true },
      include: {
        user: {
          include: {
            userRoleMaps: {
              where: { isActive: true },
              include: { role: true },
            },
          },
        },
      },
    });

    if (activeSurveyors.length > 0) {
      throw { status: 400, message: 'Cannot remove supervisor: active surveyors assigned to this ward' };
    }

    await prisma.supervisors.update({
      where: { userId: supervisorId },
      data: { wardId: null },
    });

    if (removedById) {
      await prisma.auditLog.create({
        data: {
          userId: removedById,
          action: 'REMOVE_SUPERVISOR_FROM_WARD',
          old_value: JSON.stringify({ supervisorId, wardId }),
          new_value: JSON.stringify({ supervisorId, wardId }),
        }
      });
    }

    return {
      supervisorId,
      wardId,
      reason,
      status: 'Supervisor removed from ward successfully',
    };
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
} 