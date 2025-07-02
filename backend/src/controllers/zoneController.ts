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
    const zones = mappings.map((m: any) => m.zone);
    res.json(zones);
  } catch (error) {
    console.error('Error fetching zones by ULB:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getZoneById = async (req: Request, res: Response) => {
  try {
    const { zoneId } = req.params;
    const zone = await prisma.zoneMaster.findUnique({
      where: { zoneId },
      select: {
        zoneId: true,
        zoneNumber: true,
        zoneName: true,
        isActive: true,
        description: true,
      },
    });
    
    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    
    res.json(zone);
  } catch (error) {
    console.error('Error fetching zone:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createZone = async (req: Request, res: Response) => {
  try {
    const { zoneNumber, zoneName, description } = req.body;
    
    if (!zoneNumber || !zoneName) {
      return res.status(400).json({ message: 'Zone number and name are required' });
    }
    
    const zone = await prisma.zoneMaster.create({
      data: {
        zoneNumber,
        zoneName,
        description,
        isActive: true,
      },
      select: {
        zoneId: true,
        zoneNumber: true,
        zoneName: true,
        isActive: true,
        description: true,
      },
    });
    
    res.status(201).json(zone);
  } catch (error) {
    console.error('Error creating zone:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateZone = async (req: Request, res: Response) => {
  try {
    const { zoneId } = req.params;
    const { zoneNumber, zoneName, description, isActive } = req.body;
    
    const zone = await prisma.zoneMaster.update({
      where: { zoneId },
      data: {
        zoneNumber,
        zoneName,
        description,
        isActive,
      },
      select: {
        zoneId: true,
        zoneNumber: true,
        zoneName: true,
        isActive: true,
        description: true,
      },
    });
    
    res.json(zone);
  } catch (error) {
    console.error('Error updating zone:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteZone = async (req: Request, res: Response) => {
  try {
    const { zoneId } = req.params;
    
    await prisma.zoneMaster.update({
      where: { zoneId },
      data: { isActive: false },
    });
    
    res.json({ message: 'Zone deleted successfully' });
  } catch (error) {
    console.error('Error deleting zone:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 