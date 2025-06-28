"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supervisorController_1 = require("../controllers/supervisorController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/dashboard', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERVISOR']), supervisorController_1.supervisorDashboard);
exports.default = router;
