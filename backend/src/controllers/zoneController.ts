import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllZones = async (req: Request, res: Response) => {
  try {
    const zones = await prisma.zoneMaster.findMany({
      where: { isActive: true },
      select: {
        zoneId: true,
        zoneNumber: true,
        zoneName: true,
        isActive: true,
        description: true,
      },
      orderBy: { zoneNumber: 'asc' },
    });
    res.json(zones);
  } catch (error) {
    console.error('Error fetching zones:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getZonesByUlb = async (req: Request, res: Response) => {
  try {
    const { ulbId } = req.params;
    const mappings = await prisma.ulbZoneMapping.findMany({
      where: { ulbId, isActive: true },
      include: {
        zone: {
          select: {
            zoneId: true,
            zoneNumber: true,
            zoneName: true,
            isActive: true,
            description: true,
          },
        },
      },
      orderBy: {
        zone: { zoneNumber: 'asc' },
      },
    });
    const zones = mappings.map(m => m.zone);
    res.json(zones);
  } catch (error) {
    console.error('Error fetching zones by ULB:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 