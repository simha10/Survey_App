import { PrismaClient, QCStatusEnum, QCErrorType } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fetch property list for QC based on user role and QC level access.
 * Level 1 (Survey QC): Supervisor can see surveys with QC level 1 or no QC record
 * Level 2 (In-Office QC): Admin can see surveys with QC level 2 or surveys that passed level 1
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
  userRole,
  qcLevel,
  qcDone, // Filter for QC Done status: 'ALL', 'YES', 'NO'
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
  userRole?: string;
  qcLevel?: number;
  qcDone?: string;
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

  // Fetch surveys with joins and QC filtering
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
          roadType: true,
        },
      },
      propertyDetails: true,
      ownerDetails: true,
      otherDetails: true,
      residentialPropertyAssessments: true,
      nonResidentialPropertyAssessments: true,
      qcRecords: {
        orderBy: [{ qcLevel: 'desc' }, { reviewedAt: 'desc' }],
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Apply QC level and status filtering after fetch
  return surveys.filter(survey => {
    const latestQC = survey.qcRecords[0];
    const currentQCLevel = latestQC?.qcLevel || 0;
    const currentQCStatus = latestQC?.qcStatus;

    // For Supervisor (Level 1): Show surveys without QC or at level 1
    if (userRole === 'SUPERVISOR' && qcLevel === 1) {
      // Filter by QC Done status if specified
      if (qcDone === 'YES') {
        return currentQCLevel === 1 && currentQCStatus === 'SURVEY_QC_DONE';
      }
      if (qcDone === 'NO') {
        return currentQCLevel === 0 || (currentQCLevel === 1 && currentQCStatus !== 'SURVEY_QC_DONE');
      }
      // 'ALL' or no filter: show all surveys for level 1
      return currentQCLevel <= 1;
    }

    // For Admin (Level 2): Only show surveys that passed level 1
    if (userRole === 'ADMIN' && qcLevel === 2) {
      // Filter by QC Done status if specified
      if (qcDone === 'YES') {
        return currentQCLevel === 2 && currentQCStatus === 'IN_OFFICE_QC_DONE';
      }
      if (qcDone === 'NO') {
        return currentQCLevel === 1 && currentQCStatus === 'SURVEY_QC_DONE';
      }
      // 'ALL' or no filter: show all surveys that passed level 1
      return currentQCLevel >= 1 && currentQCStatus === 'SURVEY_QC_DONE';
    }

    // Default: show all surveys
    return true;
  });
}

/**
 * Update survey details and create a new QCRecord for a given survey and level.
 * Enforces GIS ID uniqueness before approval and handles automatic status progression.
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
  
  // Map QC status based on level for automatic progression
  let finalQCStatus = qcStatus;
  if (qcLevel === 1) {
    if (qcStatus === 'APPROVED') {
      finalQCStatus = 'SURVEY_QC_DONE';
    } else if (qcStatus === 'REJECTED') {
      finalQCStatus = 'REVERTED_TO_SURVEY';
    }
  } else if (qcLevel === 2) {
    if (qcStatus === 'APPROVED') {
      finalQCStatus = 'IN_OFFICE_QC_DONE';
    } else if (qcStatus === 'REJECTED') {
      finalQCStatus = 'REVERTED_TO_IN_OFFICE';
    }
  }
  
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
      qcStatus: finalQCStatus,
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
  // Disallow bulk QC at Office QC (level 1)
  if (qcLevel === 1) {
    throw new Error('Bulk QC is not allowed at Office QC level. Please review surveys individually.');
  }
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
 * Get full QC history for a survey with reviewer details.
 */
export async function getQCHistory(surveyUniqueCode: string) {
  return prisma.qCRecord.findMany({
    where: { surveyUniqueCode },
    include: {
      reviewedBy: {
        select: {
          userId: true,
          name: true,
          username: true,
        },
      },
    },
    orderBy: [{ qcLevel: 'asc' }, { reviewedAt: 'desc' }],
  });
}

/**
 * Get QC records for a specific level with all remarks.
 */
export async function getQCByLevel(surveyUniqueCode: string, qcLevel: number) {
  return prisma.qCRecord.findFirst({
    where: { 
      surveyUniqueCode,
      qcLevel 
    },
    include: {
      reviewedBy: {
        select: {
          userId: true,
          name: true,
          username: true,
        },
      },
    },
  });
}

/**
 * Get all QC records for a survey with remarks summary.
 */
export async function getQCRemarksSummary(surveyUniqueCode: string) {
  const qcRecords = await prisma.qCRecord.findMany({
    where: { surveyUniqueCode },
    include: {
      reviewedBy: {
        select: {
          userId: true,
          name: true,
          username: true,
        },
      },
    },
    orderBy: [{ qcLevel: 'asc' }, { reviewedAt: 'desc' }],
  });

  // Group remarks by type and level
  const remarksSummary = {
    riRemarks: qcRecords.filter(r => r.RIRemark).map(r => ({
      level: r.qcLevel,
      remark: r.RIRemark,
      reviewedBy: r.reviewedBy,
      reviewedAt: r.reviewedAt,
    })),
    gisRemarks: qcRecords.filter(r => r.gisTeamRemark).map(r => ({
      level: r.qcLevel,
      remark: r.gisTeamRemark,
      reviewedBy: r.reviewedBy,
      reviewedAt: r.reviewedAt,
    })),
    surveyTeamRemarks: qcRecords.filter(r => r.surveyTeamRemark).map(r => ({
      level: r.qcLevel,
      remark: r.surveyTeamRemark,
      reviewedBy: r.reviewedBy,
      reviewedAt: r.reviewedAt,
    })),
    generalRemarks: qcRecords.filter(r => r.remarks).map(r => ({
      level: r.qcLevel,
      remark: r.remarks,
      reviewedBy: r.reviewedBy,
      reviewedAt: r.reviewedAt,
    })),
  };

  return {
    qcRecords,
    remarksSummary,
  };
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
  console.log('QC Service: Fetching property details for surveyUniqueCode:', surveyUniqueCode);
  
  try {
    const result = await prisma.surveyDetails.findUnique({
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
    
    console.log('QC Service: Query result:', result ? 'Found' : 'Not found');
    return result;
  } catch (error) {
    console.error('QC Service: Database error:', error);
    throw error;
  }
}

/**
 * Get surveys for MIS reports - view-only with current QC status display
 * Shows all surveys with their current QC level and status for reporting purposes
 */
export async function getMISReports({
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
  qcStatusFilter, // Filter by specific QC status
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
  qcStatusFilter?: string;
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

  // Fetch surveys with all QC records for MIS reporting
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
          roadType: true,
        },
      },
      propertyDetails: true,
      ownerDetails: true,
      otherDetails: true,
      residentialPropertyAssessments: true,
      nonResidentialPropertyAssessments: true,
      qcRecords: {
        orderBy: [{ qcLevel: 'desc' }, { reviewedAt: 'desc' }],
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Add current QC status information to each survey
  const surveysWithQCStatus = surveys.map(survey => {
    const latestQC = survey.qcRecords[0];
    const currentQCLevel = latestQC?.qcLevel || 0;
    const currentQCStatus = latestQC?.qcStatus || 'SURVEY_QC_PENDING';
    
    // Determine display status for MIS reports
    let displayQCLevel = 'Survey QC';
    if (currentQCLevel === 1 && currentQCStatus === 'SURVEY_QC_DONE') {
      displayQCLevel = 'Survey QC Done';
    } else if (currentQCLevel === 2) {
      displayQCLevel = 'In-Office QC';
      if (currentQCStatus === 'IN_OFFICE_QC_DONE') {
        displayQCLevel = 'In-Office QC Done';
      }
    } else if (currentQCStatus.includes('REVERTED')) {
      displayQCLevel = 'Reverted for Correction';
    }

    return {
      ...survey,
      currentQCLevel,
      currentQCStatus,
      displayQCLevel,
      qcProgress: {
        level1Completed: currentQCLevel >= 1 && currentQCStatus === 'SURVEY_QC_DONE',
        level2Completed: currentQCLevel >= 2 && currentQCStatus === 'IN_OFFICE_QC_DONE',
        hasErrors: latestQC?.isError || false,
        lastReviewedAt: latestQC?.reviewedAt,
      }
    };
  });

  // Filter by QC status if specified
  if (qcStatusFilter) {
    return surveysWithQCStatus.filter(survey => 
      survey.currentQCStatus === qcStatusFilter ||
      survey.displayQCLevel.toLowerCase().includes(qcStatusFilter.toLowerCase())
    );
  }

  return surveysWithQCStatus;
} 