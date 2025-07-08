// Service for user assignments

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Helper to log audit actions
async function logAudit({ userId, action, old_value, new_value }: { userId: string, action: string, old_value?: any, new_value?: any }) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      old_value: old_value ? JSON.stringify(old_value) : undefined,
      new_value: new_value ? JSON.stringify(new_value) : undefined,
    },
  });
}

// Bulk assign users to wards/mohallas
export const bulkAssign = async (data: any) => {
  const { userId, assignmentType, assignments, assignedById } = data;
  const assigned: any[] = [];
  const conflicts: any[] = [];

  for (const assignment of assignments) {
    const { wardId, mohallaIds } = assignment;
    // Fetch all existing assignments for this ward
    const existingAssignments = await prisma.surveyorAssignment.findMany({
      where: { wardId, isActive: true },
      select: { mohallaIds: true, userId: true }
    });
    // Flatten all already assigned mohallaIds in this ward
    const alreadyAssignedMohallaIds = new Set(
      existingAssignments.flatMap(a => a.mohallaIds)
    );
    // Find mohallas that are not yet assigned
    const toAssign = mohallaIds.filter((id: string) => !alreadyAssignedMohallaIds.has(id));
    const conflictMohallas = mohallaIds.filter((id: string) => alreadyAssignedMohallaIds.has(id));

    if (toAssign.length > 0) {
      // Check if user already has an assignment for this ward
      const userAssignment = await prisma.surveyorAssignment.findFirst({
        where: { userId, wardId, isActive: true },
      });
      if (userAssignment) {
        // Merge mohallaIds (avoid duplicates)
        const newMohallaIds = Array.from(new Set([...userAssignment.mohallaIds, ...toAssign]));
        const old_value = { mohallaIds: userAssignment.mohallaIds };
        await prisma.surveyorAssignment.update({
          where: { assignmentId: userAssignment.assignmentId },
          data: { mohallaIds: newMohallaIds, assignmentType, assignedById },
        });
        const new_value = { mohallaIds: newMohallaIds };
        await logAudit({ userId: assignedById, action: 'Assignment updated', old_value, new_value });
      } else {
        const newAssignment = await prisma.surveyorAssignment.create({
          data: {
            userId,
            assignmentType,
            wardId,
            mohallaIds: toAssign,
            assignedById,
            isActive: true,
          },
        });
        await logAudit({ userId: assignedById, action: 'Assignment created', new_value: newAssignment });
      }
      assigned.push({ wardId, mohallaIds: toAssign });
    }
    if (conflictMohallas.length > 0) {
      conflicts.push({ wardId, mohallaIds: conflictMohallas });
    }
  }
  return { success: true, assigned, conflicts };
};

// Get all assignments for a user
export const getAssignmentsByUser = async (userId: string) => {
  const assignments = await prisma.surveyorAssignment.findMany({
    where: { userId, isActive: true },
    include: {
      ward: true,
    },
  });
  // For each assignment, fetch mohalla details
  const result = await Promise.all(assignments.map(async (a) => {
    const mohallas = await prisma.mohallaMaster.findMany({
      where: { mohallaId: { in: a.mohallaIds } },
    });
    return {
      ward: a.ward,
      mohallas,
      assignmentType: a.assignmentType,
      assignmentId: a.assignmentId,
    };
  }));
  return { assignments: result };
};

// Get all assignments for a ward
export const getAssignmentsByWard = async (wardId: string) => {
  const assignments = await prisma.surveyorAssignment.findMany({
    where: { wardId, isActive: true },
    include: {
      user: true,
    },
  });
  // For each assignment, return user and mohallaIds
  const result = assignments.map(a => ({
    user: {
      userId: a.user.userId,
      name: a.user.name,
      username: a.user.username,
    },
    mohallaIds: a.mohallaIds,
    assignmentType: a.assignmentType,
    assignmentId: a.assignmentId,
  }));
  return { assignments: result };
};

// Update isActive for an assignment
export const updateAssignmentStatus = async (assignmentId: string, isActive: boolean, actingUserId?: string) => {
  const oldAssignment = await prisma.surveyorAssignment.findUnique({ where: { assignmentId } });
  const updated = await prisma.surveyorAssignment.update({
    where: { assignmentId },
    data: { isActive },
  });
  await logAudit({ userId: actingUserId || updated.userId, action: `Assignment ${isActive ? 'activated' : 'deactivated'}`, old_value: oldAssignment, new_value: updated });
  return updated;
};

// Delete an assignment (hard delete)
export const deleteAssignment = async (assignmentId: string, actingUserId?: string) => {
  const oldAssignment = await prisma.surveyorAssignment.findUnique({ where: { assignmentId } });
  await prisma.surveyorAssignment.delete({
    where: { assignmentId },
  });
  await logAudit({ userId: actingUserId || (oldAssignment?.userId ?? ''), action: 'Assignment deleted', old_value: oldAssignment });
  return { success: true };
};

// Get all assignments (admin view)
export const getAllAssignments = async () => {
  const assignments = await prisma.surveyorAssignment.findMany({
    include: {
      user: true,
      ward: true,
      assignedBy: true,
    },
  });
  // For each assignment, fetch mohalla details
  const result = await Promise.all(assignments.map(async (a) => {
    const mohallas = await prisma.mohallaMaster.findMany({
      where: { mohallaId: { in: a.mohallaIds } },
    });
    return {
      user: {
        userId: a.user.userId,
        name: a.user.name,
        username: a.user.username,
      },
      ward: a.ward,
      mohallas,
      assignedBy: a.assignedBy ? {
        userId: a.assignedBy.userId,
        name: a.assignedBy.name,
        username: a.assignedBy.username,
      } : null,
      isActive: a.isActive,
      assignmentType: a.assignmentType,
      assignmentId: a.assignmentId,
    };
  }));
  return { assignments: result };
}; 