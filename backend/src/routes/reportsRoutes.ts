import { Router } from 'express';
import { authenticateJWT, restrictToRoles } from '../middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns';

const router = Router();
const prisma = new PrismaClient();

// Reports Routes - Placeholder implementations
router.get('/dashboard', authenticateJWT, async (req, res) => {
  try {
    const totalUsers = await prisma.usersMaster.count();
    const activeWards = await prisma.wardMaster.count({ where: { isActive: true } });
    const surveyorsAssigned = await prisma.surveyorAssignment.count({ where: { isActive: true } });
    const qcCompleted = await prisma.qCRecord.count({ where: { qcStatus: 'APPROVED' } }); // Adjust as per your schema

    res.json({
      totalUsers,
      activeWards,
      surveyorsAssigned,
      qcCompleted,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

router.get('/survey-analytics', authenticateJWT, (req, res) => {
  res.status(501).json({ error: 'Reports functionality not implemented yet' });
});

router.get('/user-analytics', authenticateJWT, (req, res) => {
  res.status(501).json({ error: 'Reports functionality not implemented yet' });
});

router.get('/ward-analytics', authenticateJWT, (req, res) => {
  res.status(501).json({ error: 'Reports functionality not implemented yet' });
});

router.get('/qc-analytics', authenticateJWT, (req, res) => {
  res.status(501).json({ error: 'Reports functionality not implemented yet' });
});

router.get('/export/:format', authenticateJWT, (req, res) => {
  res.status(501).json({ error: 'Reports functionality not implemented yet' });
});

router.get('/system-health', authenticateJWT, (req, res) => {
  res.status(501).json({ error: 'Reports functionality not implemented yet' });
});

// Recent activity (audit logs)
router.get('/recent-activity', authenticateJWT, async (req, res) => {
  try {
    const { filter } = req.query;
    let where = {};
    let take = 5;
    const now = new Date();
    if (filter === 'today') {
      where = { createdAt: { gte: startOfDay(now), lte: endOfDay(now) } };
      take = 50;
    } else if (filter === 'yesterday') {
      const yesterday = subDays(now, 1);
      where = { createdAt: { gte: startOfDay(yesterday), lte: endOfDay(yesterday) } };
      take = 50;
    } else if (filter === 'week') {
      where = { createdAt: { gte: startOfWeek(now), lte: endOfWeek(now) } };
      take = 50;
    } else if (filter === 'month') {
      where = { createdAt: { gte: startOfMonth(now), lte: endOfMonth(now) } };
      take = 50;
    }
    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      include: { user: true },
    });
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

export default router; 