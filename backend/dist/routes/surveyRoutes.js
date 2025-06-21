"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const surveyController_1 = require("../controllers/surveyController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/addSurvey', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SURVEYOR', 'SUPERVISOR']), surveyController_1.submitSurvey);
exports.default = router;
