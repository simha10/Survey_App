import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUlbs = async (req: Request, res: Response) => {
  try {
    const ulbs = await prisma.ulbMaster.findMany({
      where: { isActive: true },
      select: {
        ulbId: true,
        ulbName: true,
        isActive: true,
        description: true,
      },
      orderBy: { ulbName: 'asc' },
    });
    res.json(ulbs);
  } catch (error) {
    console.error('Error fetching ULBs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUlbById = async (req: Request, res: Response) => {
  try {
    const { ulbId } = req.params;
    const ulb = await prisma.ulbMaster.findUnique({
      where: { ulbId },
      select: {
        ulbId: true,
        ulbName: true,
        isActive: true,
        description: true,
      },
    });
    
    if (!ulb) {
      return res.status(404).json({ message: 'ULB not found' });
    }
    
    res.json(ulb);
  } catch (error) {
    console.error('Error fetching ULB:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createUlb = async (req: Request, res: Response) => {
  try {
    const { ulbName, description } = req.body;
    
    if (!ulbName) {
      return res.status(400).json({ message: 'ULB name is required' });
    }
    
    const ulb = await prisma.ulbMaster.create({
      data: {
        ulbName,
        description,
        isActive: true,
      },
      select: {
        ulbId: true,
        ulbName: true,
        isActive: true,
        description: true,
      },
    });
    
    res.status(201).json(ulb);
  } catch (error) {
    console.error('Error creating ULB:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUlb = async (req: Request, res: Response) => {
  try {
    const { ulbId } = req.params;
    const { ulbName, description, isActive } = req.body;
    
    const ulb = await prisma.ulbMaster.update({
      where: { ulbId },
      data: {
        ulbName,
        description,
        isActive,
      },
      select: {
        ulbId: true,
        ulbName: true,
        isActive: true,
        description: true,
      },
    });
    
    res.json(ulb);
  } catch (error) {
    console.error('Error updating ULB:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUlb = async (req: Request, res: Response) => {
  try {
    const { ulbId } = req.params;
    
    await prisma.ulbMaster.update({
      where: { ulbId },
      data: { isActive: false },
    });
    
    res.json({ message: 'ULB deleted successfully' });
  } catch (error) {
    console.error('Error deleting ULB:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUlbWithStats = async (req: Request, res: Response) => {
  try {
    const ulbs = await prisma.ulbMaster.findMany({
      where: { isActive: true },
      select: {
        ulbId: true,
        ulbCode: true,
        ulbName: true,
        isActive: true,
        description: true,
        ulbZoneMaps: {
          where: { isActive: true },
          include: {
            zone: {
              include: {
                zoneWardMaps: {
                  where: { isActive: true },
                  include: {
                    ward: {
                      include: {
                        wardMohallaMaps: {
                          where: { isActive: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Calculate statistics for each ULB
    const ulbsWithStats = ulbs.map((ulb: any) => {
      const zones = ulb.ulbZoneMaps.map((m: any) => m.zone);
      const totalZones = zones.length;
      
      let totalWards = 0;
      let totalMohallas = 0;
      
      zones.forEach((zone: any) => {
        const wards = zone.zoneWardMaps.map((m: any) => m.ward);
        totalWards += wards.length;
        
        wards.forEach((ward: any) => {
          totalMohallas += ward.wardMohallaMaps.length;
        });
      });

      return {
        ulbId: ulb.ulbId,
        ulbCode: ulb.ulbCode || 'N/A',
        ulbName: ulb.ulbName,
        description: ulb.description,
        isActive: ulb.isActive,
        totalZones,
        totalWards,
        totalMohallas,
      };
    });

    // Sort by ULB name
    ulbsWithStats.sort((a: any, b: any) => 
      a.ulbName.localeCompare(b.ulbName)
    );

    res.json(ulbsWithStats);
  } catch (error) {
    console.error('Error fetching ULBs with stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 