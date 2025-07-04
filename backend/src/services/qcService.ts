import { PrismaClient, QCStatusEnum } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fetch property list for QC, joining all required master/mapping tables and including latest QC status.
 * Supports filtering by property type, ward, mohalla, zone, and search by owner/respondent name.
 */
export async function getPropertyListForQC({
  propertyTypeId,
  wardId,
  mohallaId,
  zoneId,
  search,
  skip = 0,
  take = 20,
}: {
  propertyTypeId?: number;
  wardId?: string;
  mohallaId?: string;
  zoneId?: string;
  search?: string;
  skip?: number;
  take?: number;
}) {
  // Build where clause for filtering
  const where: any = {};
  if (wardId) where.wardId = wardId;
  if (mohallaId) where.mohallaId = mohallaId;
  if (zoneId) where.zoneId = zoneId;

  // Join property type via locationDetails
  if (propertyTypeId) {
    where.locationDetails = { propertyTypeId };
  }

  // Search by owner/respondent name
  if (search) {
    where.OR = [
      { ownerDetails: { ownerName: { contains: search, mode: 'insensitive' } } },
      { propertyDetails: { respondentName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  // Fetch surveys with joins and latest QC status
  const surveys = await prisma.surveyDetails.findMany({
    where,
    skip,
    take,
    include: {
      ulb: true,
      zone: true,
      ward: true,
      mohalla: true,
      locationDetails: true,
      propertyDetails: true,
      ownerDetails: true,
      otherDetails: true,
      residentialPropertyAssessments: true,
      nonResidentialPropertyAssessments: true,
      qcRecords: {
        orderBy: [{ qcLevel: 'desc' }, { reviewedAt: 'desc' }],
        take: 1, // Only latest QC record
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return surveys;
}

/**
 * Update survey details and create a new QCRecord for a given survey and level.
 * Enforces GIS ID uniqueness before approval.
 */
export async function updateSurveyAndQC({
  surveyUniqueCode,
  updateData,
  qcLevel,
  qcStatus,
  remarks,
  reviewedById,
}: {
  surveyUniqueCode: string;
  updateData: any;
  qcLevel: number;
  qcStatus: QCStatusEnum;
  remarks?: string;
  reviewedById: string;
}) {
  // Check GIS ID uniqueness if approving
  if (qcStatus === 'APPROVED' && updateData.gisId) {
    const duplicate = await prisma.surveyDetails.findFirst({
      where: {
        gisId: updateData.gisId,
        NOT: { surveyUniqueCode },
      },
    });
    if (duplicate) {
      throw new Error('GIS ID is not unique. Please resolve before approval.');
    }
  }

  // Update survey details
  await prisma.surveyDetails.update({
    where: { surveyUniqueCode },
    data: updateData,
  });

  // Create QC record
  const qcRecord = await prisma.qCRecord.create({
    data: {
      surveyUniqueCode,
      qcLevel,
      qcStatus,
      reviewedById,
      remarks,
    },
  });

  return qcRecord;
}

/**
 * Bulk approve/reject surveys at the same QC level.
 */
export async function bulkQCAction({
  surveyCodes,
  qcLevel,
  qcStatus,
  remarks,
  reviewedById,
}: {
  surveyCodes: string[];
  qcLevel: number;
  qcStatus: QCStatusEnum;
  remarks?: string;
  reviewedById: string;
}) {
  // Check all surveys are at the same QC level
  // (Optional: can add logic to enforce this)

  // Bulk update
  const results = [];
  for (const surveyUniqueCode of surveyCodes) {
    const qcRecord = await updateSurveyAndQC({
      surveyUniqueCode,
      updateData: {},
      qcLevel,
      qcStatus,
      remarks,
      reviewedById,
    });
    results.push(qcRecord);
  }
  return results;
}

/**
 * Get full QC history for a survey.
 */
export async function getQCHistory(surveyUniqueCode: string) {
  return prisma.qCRecord.findMany({
    where: { surveyUniqueCode },
    orderBy: [{ qcLevel: 'asc' }, { reviewedAt: 'desc' }],
  });
}

/**
 * Get QC stats: counts by status and by level.
 */
export async function getQCStats() {
  // Count by status
  const statusCounts = await prisma.qCRecord.groupBy({
    by: ['qcStatus'],
    _count: { qcRecordId: true },
  });

  // Count by level
  const levelCounts = await prisma.qCRecord.groupBy({
    by: ['qcLevel'],
    _count: { qcRecordId: true },
  });

  // Optionally, get total surveys and pending (no QC record)
  const totalSurveys = await prisma.surveyDetails.count();
  const reviewedSurveys = await prisma.qCRecord.findMany({
    select: { surveyUniqueCode: true },
    distinct: ['surveyUniqueCode'],
  });
  const pendingCount = totalSurveys - reviewedSurveys.length;

  return {
    statusCounts,
    levelCounts,
    totalSurveys,
    pendingCount,
  };
} 