"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const masterDataController_1 = require("../controllers/masterDataController");
const router = express_1.default.Router();
// Individual master data endpoints
router.get('/response-types', authMiddleware_1.authenticateJWT, masterDataController_1.getResponseTypes);
router.get('/property-types', authMiddleware_1.authenticateJWT, masterDataController_1.getPropertyTypes);
router.get('/respondent-statuses', authMiddleware_1.authenticateJWT, masterDataController_1.getRespondentStatuses);
router.get('/road-types', authMiddleware_1.authenticateJWT, masterDataController_1.getRoadTypes);
router.get('/construction-types', authMiddleware_1.authenticateJWT, masterDataController_1.getConstructionTypes);
router.get('/water-sources', authMiddleware_1.authenticateJWT, masterDataController_1.getWaterSources);
router.get('/disposal-types', authMiddleware_1.authenticateJWT, masterDataController_1.getDisposalTypes);
router.get('/floors', authMiddleware_1.authenticateJWT, masterDataController_1.getFloors);
router.get('/nr-property-categories', authMiddleware_1.authenticateJWT, masterDataController_1.getNrPropertyCategories);
router.get('/nr-property-sub-categories', authMiddleware_1.authenticateJWT, masterDataController_1.getNrPropertySubCategories);
router.get('/construction-natures', authMiddleware_1.authenticateJWT, masterDataController_1.getConstructionNatures);
router.get('/occupancy-statuses', authMiddleware_1.authenticateJWT, masterDataController_1.getOccupancyStatuses);
router.get('/survey-types', authMiddleware_1.authenticateJWT, masterDataController_1.getSurveyTypes);
// Combined endpoint to get all master data at once
router.get('/all', authMiddleware_1.authenticateJWT, masterDataController_1.getAllMasterData);
exports.default = router;
