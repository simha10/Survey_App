import { Request, Response } from 'express';
import * as qcService from '../services/qcService';
import { QCStatusEnum } from '@prisma/client';

export const getPropertyList = async (req: Request, res: Response) => {
  try {
    const {
      propertyTypeId,
      wardId,
      mohallaId,
      zoneId,
      search,
      skip,
      take,
    } = req.query;
    const result = await qcService.getPropertyListForQC({
      propertyTypeId: propertyTypeId ? Number(propertyTypeId) : undefined,
      wardId: wardId as string,
      mohallaId: mohallaId as string,
      zoneId: zoneId as string,
      search: search as string,
      skip: skip ? Number(skip) : 0,
      take: take ? Number(take) : 20,
    });
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
    const result = await qcService.getFullPropertyDetails(surveyUniqueCode);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}; 