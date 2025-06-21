import { PrismaClient } from '@prisma/client';
import { AssignWardDto, ToggleLoginDto } from '../dtos/surveyorDto';

const prisma = new PrismaClient();

export async function assignWard(dto: AssignWardDto, assignedById: string) {
  const { userId, wardId, mohallaId, wardMohallaMapId, zoneWardMapId, ulbZoneMapId } = dto;
  try {
    // Validate user is a surveyor
    const mapping = await prisma.userRoleMapping.findFirst({
      where: { userId, isActive: true },
      include: { role: true },
    });
    if (!mapping || mapping.role.roleName !== 'SURVEYOR') {
      throw { status: 400, message: 'Invalid surveyor' };
    }
    // Validate all IDs exist
    const ward = await prisma.wardMaster.findUnique({ where: { wardId } });
    const mohalla = await prisma.mohallaMaster.findUnique({ where: { mohallaId } });
    const wardMohalla = await prisma.wardMohallaMapping.findUnique({ where: { wardMohallaMapId } });
    const zoneWard = await prisma.zoneWardMapping.findUnique({ where: { zoneWardMapId } });
    const ulbZone = await prisma.ulbZoneMapping.findUnique({ where: { ulbZoneMapId } });
    if (!ward || !mohalla || !wardMohalla || !zoneWard || !ulbZone) {
      throw { status: 400, message: 'Invalid ward/mohalla/zone/ulb' };
    }
    // Check for existing assignment
    const existingAssignment = await prisma.surveyorAssignment.findFirst({
      where: { userId, wardId, mohallaId, isActive: true },
    });
    if (existingAssignment) {
      throw { status: 409, message: 'Surveyor already assigned to ward' };
    }
    // Update Surveyors table and create assignment
    const result = await prisma.$transaction(async (tx) => {
      await tx.surveyors.update({
        where: { userId },
        data: {
          wardNumber: ward.wardNumber,
          wardMohallaMapId,
          zoneWardMapId,
          ulbZoneMapId,
        },
      });
      await tx.surveyorAssignment.create({
        data: {
          userId,
          assignmentType: 'PRIMARY',
          wardId,
          mohallaId,
          wardMohallaMapId,
          assignedById,
          isActive: true,
        },
      });
      return { userId, wardId, mohallaId, status: 'Assigned' };
    });
    return result;
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}

export async function toggleLogin(dto: ToggleLoginDto) {
  const { userId, isActive } = dto;
  try {
    // Validate user is a surveyor
    const mapping = await prisma.userRoleMapping.findFirst({
      where: { userId, isActive: true },
      include: { role: true },
    });
    if (!mapping || mapping.role.roleName !== 'SURVEYOR') {
      throw { status: 400, message: 'Invalid surveyor' };
    }
    // If disabling, check assignments and inactivity
    if (!isActive) {
      const assignments = await prisma.surveyorAssignment.findMany({
        where: { userId, isActive: true },
      });
      if (assignments.length === 0) {
        await prisma.usersMaster.update({ where: { userId }, data: { isActive: false } });
        return { userId, isActive: false, status: 'Updated' };
      }
      // Check inactivity (7+ days)
      const user = await prisma.usersMaster.findUnique({ where: { userId } });
      if (user && user.isCreatedAt && (new Date().getTime() - new Date(user.isCreatedAt).getTime()) > 7 * 24 * 60 * 60 * 1000) {
        await prisma.usersMaster.update({ where: { userId }, data: { isActive: false } });
        return { userId, isActive: false, status: 'Updated' };
      }
    }
    // Otherwise, just update isActive
    await prisma.usersMaster.update({ where: { userId }, data: { isActive } });
    return { userId, isActive, status: 'Updated' };
  } catch (err: any) {
    if (!err.status) console.error(err);
    throw err.status ? err : { status: 500, message: 'Internal server error' };
  }
}