import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getSupervisorDashboard = async (supervisorId: string) => {
  // Get all wards assigned to this supervisor
  const supervisor = await prisma.supervisors.findUnique({
    where: { userId: supervisorId },
    include: { ward: true },
  });
  if (!supervisor || !supervisor.wardId) {
    return { wards: [] };
  }
  // Get all surveyors assigned to this ward
  const assignments = await prisma.surveyorAssignment.findMany({
    where: { wardId: supervisor.wardId, isActive: true },
    include: {
      user: { select: { userId: true, username: true, name: true } },
      mohalla: { select: { mohallaId: true, mohallaName: true } },
    },
  });
  // For each mohalla, group surveyors and count surveys
  const mohallaMap: Record<string, any> = {};
  for (const assignment of assignments) {
    const mohallaId = assignment.mohallaId;
    if (!mohallaMap[mohallaId]) {
      mohallaMap[mohallaId] = {
        mohallaId,
        mohallaName: assignment.mohalla?.mohallaName,
        surveyors: [],
        surveyCount: 0,
      };
    }
    mohallaMap[mohallaId].surveyors.push({
      userId: assignment.user.userId,
      username: assignment.user.username,
      name: assignment.user.name,
    });
    // Count surveys for this surveyor in this mohalla
    // (Assuming SurveyDetails has mohallaId and uploadedById)
    // You may want to optimize this with a single query if needed
    mohallaMap[mohallaId].surveyCount += await prisma.surveyDetails.count({
      where: {
        mohallaId,
        uploadedById: assignment.user.userId,
      },
    });
  }
  return {
    wardId: supervisor.wardId,
    wardName: supervisor.ward?.wardName,
    mohallas: Object.values(mohallaMap),
  };
}; 