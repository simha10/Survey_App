import { PrismaClient, QCStatusEnum, QCErrorType } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fetch property list for QC, joining all required master/mapping tables and including latest QC status.
 * Supports filtering by property type, ward, mohalla, zone, and search by owner/respondent name.
 */
export async function getPropertyListForQC({
  propertyTypeId,
  surveyTypeId,
  wardId,
  mohallaId,
  zoneId,
  ulbId,
  search,
  skip = 0,
  take = 20,
  fromDate,
  toDate,
}: {
  propertyTypeId?: number;
  surveyTypeId?: number;
  wardId?: string;
  mohallaId?: string;
  zoneId?: string;
  ulbId?: string;
  search?: string;
  skip?: number;
  take?: number;
  fromDate?: string;
  toDate?: string;
}) {
  // Build where clause for filtering
  const where: any = {};
  if (wardId) where.wardId = wardId;
  if (mohallaId) where.mohallaId = mohallaId;
  if (zoneId) where.zoneId = zoneId;
  if (ulbId) where.ulbId = ulbId;

  // Merge locationDetails filter
  if (propertyTypeId) {
    where.locationDetails = { ...(where.locationDetails || {}), propertyTypeId };
  }

  // Filter by surveyTypeId
  if (surveyTypeId) {
    where.surveyTypeId = surveyTypeId;
  }

  // Date range filter
  if (fromDate && toDate) {
    where.entryDate = {
      gte: new Date(fromDate),
      lte: new Date(toDate),
    };
  } else if (fromDate) {
    where.entryDate = {
      gte: new Date(fromDate),
    };
  } else if (toDate) {
    where.entryDate = {
      lte: new Date(toDate),
    };
  }

  // Search by owner/respondent name
  if (search) {
    where.OR = [
      { ownerDetails: { ownerName: { contains: search, mode: 'insensitive' } } },
      { propertyDetails: { respondentName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  // Debug: log the where clause
  console.log('QC Property List WHERE:', JSON.stringify(where, null, 2));

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
      locationDetails: {
        include: {
          propertyType: true,
          roadType: true,        },
      },
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
  isError,
  errorType,
  gisTeamRemark,
  surveyTeamRemark,
  RIRemark,
}: {
  surveyUniqueCode: string;
  updateData: any;
  qcLevel: number;
  qcStatus: any;
  remarks?: string;
  reviewedById: string;
  isError?: boolean;
  errorType?: string;
  gisTeamRemark?: string;
  surveyTeamRemark?: string;
  RIRemark?: string;
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

  // Validate errorType as QCErrorType enum
  const validErrorTypes = ['MISSING', 'DUPLICATE', 'OTHER', 'NONE'];
  const safeErrorType = validErrorTypes.includes(errorType as string)
    ? (errorType as QCErrorType)
    : QCErrorType.NONE;
  
  // Update survey details
  await prisma.surveyDetails.update({
    where: { surveyUniqueCode },
    data: updateData,
  });

  // Create QC record with new fields
  const qcRecord = await prisma.qCRecord.create({
    data: {
      surveyUniqueCode,
      qcLevel,
      qcStatus,
      reviewedById,
      remarks,
      isError,
      errorType: safeErrorType,
      gisTeamRemark,
      surveyTeamRemark,
      RIRemark,
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
  isError,
  errorType,
  gisTeamRemark,
  surveyTeamRemark,
  RIRemark,
}: {
  surveyCodes: string[];
  qcLevel: number;
  qcStatus: QCStatusEnum;
  remarks?: string;
  reviewedById: string;
  isError?: boolean;
  errorType?: string;
  gisTeamRemark?: string;
  surveyTeamRemark?: string;
  RIRemark?: string;
}) {
  const results = [];
  for (const surveyUniqueCode of surveyCodes) {
    const qcRecord = await updateSurveyAndQC({
      surveyUniqueCode,
      updateData: {},
      qcLevel,
      qcStatus,
      remarks,
      reviewedById,
      isError,
      errorType,
      gisTeamRemark,
      surveyTeamRemark,
      RIRemark,
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

export async function getFullPropertyDetails(surveyUniqueCode: string) {
  return prisma.surveyDetails.findUnique({
    where: { surveyUniqueCode },
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
      propertyAttachments: true,
      qcRecords: {
        orderBy: [{ qcLevel: 'asc' }, { reviewedAt: 'desc' }],
      },
    },
  });
} 