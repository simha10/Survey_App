"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const surveyController_1 = require("../controllers/surveyController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// ========================================
// SURVEY SUBMISSION ROUTES (MOBILE APP)
// ========================================
// Submit new survey (mobile app)
router.post('/addSurvey', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SURVEYOR', 'SUPERVISOR']), surveyController_1.submitSurvey);
// ========================================
// SURVEY MANAGEMENT ROUTES (WEB PORTAL)
// ========================================
// Get all surveys with pagination and filters
router.get('/', authMiddleware_1.authenticateJWT, authMiddleware_1.restrictToWebPortal, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Mock response for now - implement actual controller
        res.json({
            data: [],
            pagination: {
                page: 1,
                limit: 10,
                total: 0
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch surveys' });
    }
}));
// Get survey by ID
router.get('/:surveyUniqueCode', authMiddleware_1.authenticateJWT, authMiddleware_1.restrictToWebPortal, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { surveyUniqueCode } = req.params;
        // Mock response for now - implement actual controller
        res.json({
            data: {
                surveyUniqueCode,
                gisId: 'GIS123',
                uploadedBy: { username: 'admin1', name: 'Admin User' },
                createdAt: new Date().toISOString()
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch survey' });
    }
}));
// Sync survey
router.post('/:surveyUniqueCode/sync', authMiddleware_1.authenticateJWT, authMiddleware_1.restrictToWebPortal, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { surveyUniqueCode } = req.params;
        // Mock response for now - implement actual controller
        res.json({
            message: `Survey ${surveyUniqueCode} synced successfully`,
            data: { surveyUniqueCode, syncStatus: 'SYNCED' }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to sync survey' });
    }
}));
// Bulk sync surveys
router.post('/bulk-sync', authMiddleware_1.authenticateJWT, authMiddleware_1.restrictToWebPortal, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { surveyUniqueCodes } = req.body;
        // Mock response for now - implement actual controller
        res.json({
            message: `${surveyUniqueCodes.length} surveys synced successfully`,
            data: { syncedCount: surveyUniqueCodes.length }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to bulk sync surveys' });
    }
}));
// Get survey statistics
router.get('/stats/overview', authMiddleware_1.authenticateJWT, authMiddleware_1.restrictToWebPortal, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Mock response for now - implement actual controller
        res.json({
            data: {
                totalSurveys: 1250,
                syncedSurveys: 1100,
                pendingSync: 100,
                failedSync: 30,
                conflictSync: 20
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch survey stats' });
    }
}));
// Get surveys by ward
router.get('/ward/:wardId', authMiddleware_1.authenticateJWT, authMiddleware_1.restrictToWebPortal, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wardId } = req.params;
        // Mock response for now - implement actual controller
        res.json({
            data: []
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch surveys by ward' });
    }
}));
// Get surveys by user
router.get('/user/:userId', authMiddleware_1.authenticateJWT, authMiddleware_1.restrictToWebPortal, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Mock response for now - implement actual controller
        res.json({
            data: []
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch surveys by user' });
    }
}));
// Get surveys by status
router.get('/status/:status', authMiddleware_1.authenticateJWT, authMiddleware_1.restrictToWebPortal, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.params;
        // Mock response for now - implement actual controller
        res.json({
            data: []
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch surveys by status' });
    }
}));
// Search surveys
router.get('/search', authMiddleware_1.authenticateJWT, authMiddleware_1.restrictToWebPortal, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { q, wardId, userId, status, syncStatus } = req.query;
        // Mock response for now - implement actual controller
        res.json({
            data: []
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to search surveys' });
    }
}));
exports.default = router;
