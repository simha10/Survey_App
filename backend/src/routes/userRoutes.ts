import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticateJWT, restrictToRoles } from '../middleware/authMiddleware';

const router = Router();

// ========================================
// PROFILE MANAGEMENT ROUTES (All authenticated users)
// ========================================

// Update own profile
router.put(
  '/profile',
  authenticateJWT,
  userController.updateProfile
);

// Change own password
router.put(
  '/change-password',
  authenticateJWT,
  userController.changePassword
);

// Get own profile
router.get(
  '/profile',
  authenticateJWT,
  userController.getUserProfile
);

// ========================================
// USER MANAGEMENT ROUTES (ADMIN/SUPERADMIN only)
// ========================================

// Get all users (with pagination and filtering)
router.get(
  '/',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  userController.getUsers
);

// Get user by ID
router.get(
  '/:userId',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  userController.getUserById
);

// Update user status
router.put(
  '/status',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  userController.updateUserStatus
);

// Update user (for admin purposes)
router.put(
  '/update',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  userController.updateUser
);

// Delete user (soft delete)
router.delete(
  '/',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  userController.deleteUser
);

// ========================================
// ROLE MANAGEMENT ROUTES (ADMIN/SUPERADMIN only)
// ========================================

// Assign role to user
router.post(
  '/assign-role',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  userController.assignRole
);

// Remove role from user
router.delete(
  '/remove-role',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  userController.removeRole
);

// ========================================
// QUERY ROUTES (All authenticated users)
// ========================================

// Search users
router.get(
  '/search',
  authenticateJWT,
  userController.searchUsers
);

// Get user statistics
router.get(
  '/stats',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  userController.getUserStats
);

// Get available roles (for dropdowns)
router.get(
  '/roles',
  authenticateJWT,
  userController.getAvailableRoles
);

// Get users by role
router.get(
  '/by-role/:role',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  userController.getUsersByRole
);

// Get active users count
router.get(
  '/count/active',
  authenticateJWT,
  restrictToRoles(['SUPERADMIN', 'ADMIN']),
  userController.getActiveUsersCount
);

export default router; 