import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import {
  getResponseTypes,
  getPropertyTypes,
  getRespondentStatuses,
  getRoadTypes,
  getConstructionTypes,
  getWaterSources,
  getDisposalTypes,
  getFloors,
  getNrPropertyCategories,
  getNrPropertySubCategories,
  getConstructionNatures,
  getOccupancyStatuses,
  getSurveyTypes,
  getAllMasterData,
} from '../controllers/masterDataController';

const router = express.Router();

// Individual master data endpoints
router.get('/response-types', authenticateJWT, getResponseTypes);
router.get('/property-types', authenticateJWT, getPropertyTypes);
router.get('/respondent-statuses', authenticateJWT, getRespondentStatuses);
router.get('/road-types', authenticateJWT, getRoadTypes);
router.get('/construction-types', authenticateJWT, getConstructionTypes);
router.get('/water-sources', authenticateJWT, getWaterSources);
router.get('/disposal-types', authenticateJWT, getDisposalTypes);
router.get('/floors', authenticateJWT, getFloors);
router.get('/nr-property-categories', authenticateJWT, getNrPropertyCategories);
router.get('/nr-property-sub-categories', authenticateJWT, getNrPropertySubCategories);
router.get('/construction-natures', authenticateJWT, getConstructionNatures);
router.get('/occupancy-statuses', authenticateJWT, getOccupancyStatuses);
router.get('/survey-types', authenticateJWT, getSurveyTypes);

// Combined endpoint to get all master data at once
router.get('/all', authenticateJWT, getAllMasterData);

export default router; 