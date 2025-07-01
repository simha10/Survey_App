"use client";
import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { getAllZones, getZonesByUlb } from '../controllers/zoneController';

const router = express.Router();

router.get('/', authenticateJWT, getAllZones);
router.get('/ulb/:ulbId', authenticateJWT, getZonesByUlb);

export default router; 