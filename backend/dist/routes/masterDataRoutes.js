"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Placeholder routes - can be implemented later
router.get('/property-types', authMiddleware_1.authenticateJWT, (req, res) => {
    res.json({ message: 'Property types endpoint - to be implemented' });
});
router.get('/construction-types', authMiddleware_1.authenticateJWT, (req, res) => {
    res.json({ message: 'Construction types endpoint - to be implemented' });
});
router.get('/occupancy-statuses', authMiddleware_1.authenticateJWT, (req, res) => {
    res.json({ message: 'Occupancy statuses endpoint - to be implemented' });
});
exports.default = router;
