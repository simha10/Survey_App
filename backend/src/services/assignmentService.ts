// Service for user assignments

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
        await prisma.surveyorAssignment.update({
          where: { assignmentId: userAssignment.assignmentId },
          data: { mohallaIds: newMohallaIds, assignmentType, assignedById },
        });
      } else {
        await prisma.surveyorAssignment.create({
          data: {
            userId,
            assignmentType,
            wardId,
            mohallaIds: toAssign,
            assignedById,
            isActive: true,
          },
        });
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