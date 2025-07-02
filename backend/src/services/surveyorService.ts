import { PrismaClient, Prisma } from '@prisma/client';
import { AssignWardDto, ToggleLoginDto } from '../dtos/surveyorDto';

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

// Helper function to validate ward entities
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

export async function assignWard(dto: AssignWardDto, assignedById: string) {
  const { userId, wardId, mohallaId, wardMohallaMapId, zoneWardMapId, ulbZoneMapId, assignmentType = 'PRIMARY' } = dto;
  
  try {
    // Validate user is a surveyor
    await validateUserRole(userId, 'SURVEYOR');

    // Validate ward entities
    const { ward } = await validateWardEntities(wardId, mohallaId, wardMohallaMapId, zoneWardMapId, ulbZoneMapId);

    // Check for existing assignment
    const existingAssignment = await prisma.surveyorAssignment.findFirst({
      where: { userId, wardId, mohallaId, isActive: true },
    });

    if (existingAssignment) {
      throw { status: 409, message: 'Surveyor already assigned to this ward-mohalla combination' };
    }

    // Update Surveyors table and create assignment
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update surveyor's ward information
      await tx.surveyors.update({
        where: { userId },
        data: {
          wardMohallaMapId,
          zoneWardMapId,
          ulbZoneMapId,
        },
      });

      // Create assignment record
      const assignment = await tx.surveyorAssignment.create({
        data: {
          userId,
          assignmentType,
          wardId,
          mohallaId,
          wardMohallaMapId,
          assignedById,
          isActive: true,
        },
      });

      return assignment;
    });

    return {
      assignmentId: result.assignmentId,
      userId,
      wardId,
      mohallaId,
      assignmentType,
      status: 'Ward assigned successfully',
    };
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}

export async function toggleLogin(dto: ToggleLoginDto) {
  const { userId, isActive } = dto;
  
  try {
    // Validate user is a surveyor
    await validateUserRole(userId, 'SURVEYOR');

    // If disabling, check assignments and inactivity
    if (!isActive) {
      const assignments = await prisma.surveyorAssignment.findMany({
        where: { userId, isActive: true },
      });

      if (assignments.length === 0) {
        await prisma.usersMaster.update({ 
          where: { userId }, 
          data: { isActive: false } 
        });
        return { userId, isActive: false, status: 'Surveyor deactivated - no active assignments' };
      }

      // Check inactivity (7+ days)
      const user = await prisma.usersMaster.findUnique({ where: { userId } });
      if (user && user.isCreatedAt) {
        const daysSinceCreation = (new Date().getTime() - new Date(user.isCreatedAt).getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceCreation > 7) {
          await prisma.usersMaster.update({ 
            where: { userId }, 
            data: { isActive: false } 
          });
          return { userId, isActive: false, status: 'Surveyor deactivated - inactive for 7+ days' };
        }
      }
    }

    // Update user status
    await prisma.usersMaster.update({ 
      where: { userId }, 
      data: { isActive } 
    });

    return { 
      userId, 
      isActive, 
      status: isActive ? 'Surveyor activated' : 'Surveyor deactivated' 
    };
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}

// Additional surveyor management functions

export async function getSurveyorAssignments(userId: string) {
  try {
    // Validate user is a surveyor
    await validateUserRole(userId, 'SURVEYOR');

    const assignments = await prisma.surveyorAssignment.findMany({
      where: { userId, isActive: true },
      include: {
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
      orderBy: { assignmentId: 'desc' },
    });

    return {
      userId,
      assignments,
      total: assignments.length,
    };
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}

export async function removeWardAssignment(assignmentId: string, removedById: string) {
  try {
    const assignment = await prisma.surveyorAssignment.findUnique({
      where: { assignmentId },
      include: { user: true },
    });

    if (!assignment) {
      throw { status: 404, message: 'Assignment not found' };
    }

    // Validate user is a surveyor
    await validateUserRole(assignment.userId, 'SURVEYOR');

    const result = await prisma.surveyorAssignment.update({
      where: { assignmentId },
      data: { isActive: false },
    });

    return {
      assignmentId,
      userId: assignment.userId,
      wardId: assignment.wardId,
      status: 'Ward assignment removed successfully',
    };
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}

export async function getSurveyorProfile(userId: string) {
  try {
    // Validate user is a surveyor
    await validateUserRole(userId, 'SURVEYOR');

    const surveyor = await prisma.surveyors.findUnique({
      where: { userId },
      include: {
        user: {
          include: {
            userRoleMaps: {
              where: { isActive: true },
              include: { role: true },
            },
          },
        },
        wardMohallaMap: {
          include: {
            ward: true,
            mohalla: true,
          },
        },
        zoneWardMap: {
          include: {
            zone: true,
            ward: true,
          },
        },
        ulbZoneMap: {
          include: {
            ulb: true,
            zone: true,
          },
        },
      },
    });

    if (!surveyor) {
      throw { status: 404, message: 'Surveyor not found' };
    }

    return {
      userId: surveyor.userId,
      surveyorName: surveyor.surveyorName,
      username: surveyor.username,
      isActive: surveyor.user.isActive,
      ward: surveyor.wardMohallaMap?.ward || null,
      mohalla: surveyor.wardMohallaMap?.mohalla || null,
      zone: surveyor.zoneWardMap?.zone || null,
      ulb: surveyor.ulbZoneMap?.ulb || null,
      role: surveyor.user.userRoleMaps[0]?.role.roleName || null,
    };
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}