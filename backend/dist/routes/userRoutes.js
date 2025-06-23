"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController = __importStar(require("../controllers/userController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// ========================================
// PROFILE MANAGEMENT ROUTES (All authenticated users)
// ========================================
// Update own profile
router.put('/profile', authMiddleware_1.authenticateJWT, userController.updateProfile);
// Change own password
router.put('/change-password', authMiddleware_1.authenticateJWT, userController.changePassword);
// Get own profile
router.get('/profile', authMiddleware_1.authenticateJWT, userController.getUserProfile);
// ========================================
// USER MANAGEMENT ROUTES (ADMIN/SUPERADMIN only)
// ========================================
// Get all users (with pagination and filtering)
router.get('/', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERADMIN', 'ADMIN']), userController.getUsers);
// Get user by ID
router.get('/:userId', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERADMIN', 'ADMIN']), userController.getUserById);
// Update user status
router.put('/status', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERADMIN', 'ADMIN']), userController.updateUserStatus);
// Delete user (soft delete)
router.delete('/', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERADMIN', 'ADMIN']), userController.deleteUser);
// ========================================
// ROLE MANAGEMENT ROUTES (ADMIN/SUPERADMIN only)
// ========================================
// Assign role to user
router.post('/assign-role', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERADMIN', 'ADMIN']), userController.assignRole);
// Remove role from user
router.delete('/remove-role', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERADMIN', 'ADMIN']), userController.removeRole);
// ========================================
// QUERY ROUTES (All authenticated users)
// ========================================
// Search users
router.get('/search', authMiddleware_1.authenticateJWT, userController.searchUsers);
// Get user statistics
router.get('/stats', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERADMIN', 'ADMIN']), userController.getUserStats);
// Get available roles (for dropdowns)
router.get('/roles', authMiddleware_1.authenticateJWT, userController.getAvailableRoles);
// Get users by role
router.get('/by-role/:role', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERADMIN', 'ADMIN']), userController.getUsersByRole);
// Get active users count
router.get('/count/active', authMiddleware_1.authenticateJWT, (0, authMiddleware_1.restrictToRoles)(['SUPERADMIN', 'ADMIN']), userController.getActiveUsersCount);
exports.default = router;
