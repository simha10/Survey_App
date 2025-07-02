import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllMohallas = async (req: Request, res: Response) => {
  try {
    const mohallas = await prisma.mohallaMaster.findMany({
      where: { isActive: true },
      select: {
        mohallaId: true,
        mohallaName: true,
        isActive: true,
        description: true,
      },
      orderBy: { mohallaName: 'asc' },
    });
    res.json(mohallas);
  } catch (error) {
    console.error('Error fetching mohallas:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMohallasByWard = async (req: Request, res: Response) => {
  try {
    const { wardId } = req.params;
    
    // Get ward status first
    const wardStatus = await prisma.wardStatusMapping.findFirst({
      where: { wardId, isActive: true },
      include: {
        status: {
          select: {
            wardStatusId: true,
            statusName: true,
            description: true
          }
        }
      }
    });

    const mappings = await prisma.wardMohallaMapping.findMany({
      where: { wardId, isActive: true },
      include: {
        mohalla: {
          select: {
            mohallaId: true,
            mohallaName: true,
            isActive: true,
            description: true,
          },
        },
      },
      orderBy: {
        mohalla: { mohallaName: 'asc' },
      },
    });
    
    const mohallas = mappings.map(m => ({
      ...m.mohalla,
      inheritedStatus: wardStatus?.status?.statusName || "Not Started"
    }));
    
    res.json(mohallas);
  } catch (error) {
    console.error('Error fetching mohallas by ward:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMohallaById = async (req: Request, res: Response) => {
  try {
    const { mohallaId } = req.params;
    const mohalla = await prisma.mohallaMaster.findUnique({
      where: { mohallaId },
      select: {
        mohallaId: true,
        mohallaName: true,
        isActive: true,
        description: true,
      },
    });
    
    if (!mohalla) {
      return res.status(404).json({ message: 'Mohalla not found' });
    }
    
    res.json(mohalla);
  } catch (error) {
    console.error('Error fetching mohalla:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createMohalla = async (req: Request, res: Response) => {
  try {
    const { mohallaName, description } = req.body;
    
    if (!mohallaName) {
      return res.status(400).json({ message: 'Mohalla name is required' });
    }
    
    const mohalla = await prisma.mohallaMaster.create({
      data: {
        mohallaName,
        description,
        isActive: true,
      },
      select: {
        mohallaId: true,
        mohallaName: true,
        isActive: true,
        description: true,
      },
    });
    
    res.status(201).json(mohalla);
  } catch (error) {
    console.error('Error creating mohalla:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateMohalla = async (req: Request, res: Response) => {
  try {
    const { mohallaId } = req.params;
    const { mohallaName, description, isActive } = req.body;
    
    const mohalla = await prisma.mohallaMaster.update({
      where: { mohallaId },
      data: {
        mohallaName,
        description,
        isActive,
      },
      select: {
        mohallaId: true,
        mohallaName: true,
        isActive: true,
        description: true,
      },
    });
    
    res.json(mohalla);
  } catch (error) {
    console.error('Error updating mohalla:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteMohalla = async (req: Request, res: Response) => {
  try {
    const { mohallaId } = req.params;
    
    await prisma.mohallaMaster.update({
      where: { mohallaId },
      data: { isActive: false },
    });
    
    res.json({ message: 'Mohalla deleted successfully' });
  } catch (error) {
    console.error('Error deleting mohalla:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update status for a single mohalla
export const updateMohallaStatus = async (req: Request, res: Response) => {
  try {
    const { mohallaId } = req.params;
    const { wardStatusId } = req.body;
    if (!mohallaId || !wardStatusId) {
      return res.status(400).json({ error: 'mohallaId and wardStatusId are required' });
    }
    // Deactivate all previous status mappings for this mohalla
    await prisma.wardStatusMapping.updateMany({
      where: { wardId: mohallaId },
      data: { isActive: false },
    });
    // Create new status mapping for the mohalla
    await prisma.wardStatusMapping.create({
      data: {
        wardId: mohallaId, // treat mohallaId as wardId for mapping
        wardStatusId,
        changedById: (req as any).user.userId,
        isActive: true,
      },
    });
    res.json({ message: 'Status updated for mohalla.' });
  } catch (error) {
    console.error('Error updating mohalla status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search mohallas by name
export const searchMohallas = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    
    if (!search || typeof search !== 'string') {
      return res.status(400).json({ error: 'Search parameter is required' });
    }

    const mohallas = await prisma.mohallaMaster.findMany({
      where: {
        isActive: true,
        mohallaName: {
          contains: search,
          mode: 'insensitive'
        }
      },
      select: {
        mohallaId: true,
        mohallaName: true,
        isActive: true,
        description: true,
      },
      orderBy: { mohallaName: 'asc' },
    });

    res.json(mohallas);
  } catch (error) {
    console.error('Error searching mohallas:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 