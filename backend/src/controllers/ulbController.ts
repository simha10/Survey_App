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