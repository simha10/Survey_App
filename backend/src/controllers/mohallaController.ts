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
    const mohallas = mappings.map(m => m.mohalla);
    res.json(mohallas);
  } catch (error) {
    console.error('Error fetching mohallas by ward:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 