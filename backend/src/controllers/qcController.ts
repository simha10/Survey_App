import { Request, Response } from 'express';
import * as qcService from '../services/qcService';
import { QCStatusEnum, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPropertyList = async (req: Request, res: Response) => {
  try {
    const {
      propertyTypeId,
      surveyTypeId,
      wardId,
      mohallaId,
      zoneId,
      ulbId,
      search,
      skip,
      take,
      fromDate,
      toDate,
      userRole,
      qcLevel,
      qcDone,
    } = req.query;
    const result = await qcService.getPropertyListForQC({
      propertyTypeId: propertyTypeId ? Number(propertyTypeId) : undefined,
      surveyTypeId: surveyTypeId ? Number(surveyTypeId) : undefined,
      wardId: wardId as string,
      mohallaId: mohallaId as string,
      zoneId: zoneId as string,
      ulbId: ulbId as string,
      search: search as string,
      skip: skip ? Number(skip) : 0,
      take: take ? Number(take) : 20,
      fromDate: fromDate as string,
      toDate: toDate as string,
      userRole: userRole as string,
      qcLevel: qcLevel ? Number(qcLevel) : undefined,
      qcDone: qcDone as string,
    });
    try {
      const count = Array.isArray(result) ? result.length : (result ? 1 : 0);
      res.setHeader('X-Total-Count', String(count));
    } catch (e) {
      // ignore header set errors
    }
    console.log('QC Property List RESULT COUNT:', Array.isArray(result) ? result.length : 0);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSurveyQC = async (req: Request, res: Response) => {
  try {
    const { surveyUniqueCode } = req.params;
    const { updateData, qcLevel, qcStatus, remarks, reviewedById, isError, errorType, gisTeamRemark, surveyTeamRemark, RIRemark } = req.body;
    const result = await qcService.updateSurveyAndQC({
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
    });
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const bulkQCAction = async (req: Request, res: Response) => {
  try {
    const { surveyCodes, qcLevel, qcStatus, remarks, reviewedById, isError, errorType, gisTeamRemark, surveyTeamRemark, RIRemark } = req.body;
    const result = await qcService.bulkQCAction({
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
    });
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getQCHistory = async (req: Request, res: Response) => {
  try {
    const { surveyUniqueCode } = req.params;
    const result = await qcService.getQCHistory(surveyUniqueCode);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getQCStats = async (req: Request, res: Response) => {
  try {
    const result = await qcService.getQCStats();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getFullPropertyDetails = async (req: Request, res: Response) => {
  try {
    const { surveyUniqueCode } = req.params;
    console.log('QC Controller: Received request for surveyUniqueCode:', surveyUniqueCode);
    
    // First, let's check if there are any survey records at all
    const totalSurveys = await prisma.surveyDetails.count();
    console.log('QC Controller: Total surveys in database:', totalSurveys);
    
    if (totalSurveys === 0) {
      console.log('QC Controller: No surveys found in database');
      return res.status(404).json({ error: "No survey records found in database" });
    }
    
    // Check if the specific survey exists
    const surveyExists = await prisma.surveyDetails.findUnique({
      where: { surveyUniqueCode },
      select: { surveyUniqueCode: true }
    });
    
    if (!surveyExists) {
      console.log('QC Controller: Survey not found for surveyUniqueCode:', surveyUniqueCode);
      // Let's also show some sample survey codes for debugging
      const sampleSurveys = await prisma.surveyDetails.findMany({
        take: 5,
        select: { surveyUniqueCode: true }
      });
      console.log('QC Controller: Sample survey codes:', sampleSurveys);
      return res.status(404).json({ 
        error: "Property not found",
        availableSurveys: sampleSurveys.map(s => s.surveyUniqueCode)
      });
    }
    
    const result = await qcService.getFullPropertyDetails(surveyUniqueCode);
    if (!result) {
      console.log('QC Controller: Property not found for surveyUniqueCode:', surveyUniqueCode);
      return res.status(404).json({ error: "Property not found" });
    }
    
    console.log('QC Controller: Returning property data for surveyUniqueCode:', surveyUniqueCode);
    res.json(result);
  } catch (error: any) {
    console.error('QC Controller: Error fetching property:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getQCRemarksSummary = async (req: Request, res: Response) => {
  try {
    const { surveyUniqueCode } = req.params;
    const result = await qcService.getQCRemarksSummary(surveyUniqueCode);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getQCByLevel = async (req: Request, res: Response) => {
  try {
    const { surveyUniqueCode, qcLevel } = req.params;
    const result = await qcService.getQCByLevel(surveyUniqueCode, parseInt(qcLevel));
    if (!result) {
      return res.status(404).json({ error: "QC record not found for this level" });
    }
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get MIS reports - view-only data with QC status information
 */
export const getMISReports = async (req: Request, res: Response) => {
  try {
    const {
      propertyTypeId,
      surveyTypeId,
      wardId,
      mohallaId,
      zoneId,
      ulbId,
      search,
      skip,
      take,
      fromDate,
      toDate,
      qcStatusFilter,
    } = req.query;
    
    const result = await qcService.getMISReports({
      propertyTypeId: propertyTypeId ? Number(propertyTypeId) : undefined,
      surveyTypeId: surveyTypeId ? Number(surveyTypeId) : undefined,
      wardId: wardId as string,
      mohallaId: mohallaId as string,
      zoneId: zoneId as string,
      ulbId: ulbId as string,
      search: search as string,
      skip: skip ? Number(skip) : 0,
      take: take ? Number(take) : 20,
      fromDate: fromDate as string,
      toDate: toDate as string,
      qcStatusFilter: qcStatusFilter as string,
    });
    
    try {
      const count = Array.isArray(result) ? result.length : (result ? 1 : 0);
      res.setHeader('X-Total-Count', String(count));
    } catch (e) {
      // ignore header set errors
    }
    
    console.log('MIS Reports RESULT COUNT:', Array.isArray(result) ? result.length : 0);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}; 