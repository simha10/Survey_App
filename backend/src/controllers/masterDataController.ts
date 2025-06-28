import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getResponseTypes = async (req: Request, res: Response) => {
  try {
    const responseTypes = await prisma.responseTypeMaster.findMany({
      where: { isActive: true },
      select: {
        responseTypeId: true,
        responseTypeName: true,
        description: true,
      },
      orderBy: { responseTypeName: 'asc' },
    });

    res.json(responseTypes);
  } catch (error) {
    console.error('Error fetching response types:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPropertyTypes = async (req: Request, res: Response) => {
  try {
    const propertyTypes = await prisma.propertyTypeMaster.findMany({
      where: { isActive: true },
      select: {
        propertyTypeId: true,
        propertyTypeName: true,
        description: true,
      },
      orderBy: { propertyTypeName: 'asc' },
    });

    res.json(propertyTypes);
  } catch (error) {
    console.error('Error fetching property types:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRespondentStatuses = async (req: Request, res: Response) => {
  try {
    const respondentStatuses = await prisma.respondentStatusMaster.findMany({
      where: { isActive: true },
      select: {
        respondentStatusId: true,
        respondentStatusName: true,
        description: true,
      },
      orderBy: { respondentStatusName: 'asc' },
    });

    res.json(respondentStatuses);
  } catch (error) {
    console.error('Error fetching respondent statuses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRoadTypes = async (req: Request, res: Response) => {
  try {
    const roadTypes = await prisma.roadTypeMaster.findMany({
      where: { isActive: true },
      select: {
        roadTypeId: true,
        roadTypeName: true,
        description: true,
      },
      orderBy: { roadTypeName: 'asc' },
    });

    res.json(roadTypes);
  } catch (error) {
    console.error('Error fetching road types:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getConstructionTypes = async (req: Request, res: Response) => {
  try {
    const constructionTypes = await prisma.constructionTypeMaster.findMany({
      where: { isActive: true },
      select: {
        constructionTypeId: true,
        constructionTypeName: true,
        description: true,
      },
      orderBy: { constructionTypeName: 'asc' },
    });

    res.json(constructionTypes);
  } catch (error) {
    console.error('Error fetching construction types:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getWaterSources = async (req: Request, res: Response) => {
  try {
    const waterSources = await prisma.waterSourceMaster.findMany({
      where: { isActive: true },
      select: {
        waterSourceId: true,
        waterSourceName: true,
        description: true,
      },
      orderBy: { waterSourceName: 'asc' },
    });

    res.json(waterSources);
  } catch (error) {
    console.error('Error fetching water sources:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDisposalTypes = async (req: Request, res: Response) => {
  try {
    const disposalTypes = await prisma.disposalTypeMaster.findMany({
      where: { isActive: true },
      select: {
        disposalTypeId: true,
        disposalTypeName: true,
        description: true,
      },
      orderBy: { disposalTypeName: 'asc' },
    });

    res.json(disposalTypes);
  } catch (error) {
    console.error('Error fetching disposal types:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFloors = async (req: Request, res: Response) => {
  try {
    const floors = await prisma.floorMaster.findMany({
      where: { isActive: true },
      select: {
        floorNumberId: true,
        floorNumberName: true,
        description: true,
      },
      orderBy: { floorNumberId: 'asc' },
    });

    res.json(floors);
  } catch (error) {
    console.error('Error fetching floors:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getNrPropertyCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.nrPropertyCategoryMaster.findMany({
      where: { isActive: true },
      select: {
        propertyCategoryId: true,
        propertyCategoryNumber: true,
        propertyCategoryName: true,
        description: true,
      },
      orderBy: { propertyCategoryNumber: 'asc' },
    });

    res.json(categories);
  } catch (error) {
    console.error('Error fetching NR property categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getNrPropertySubCategories = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;
    
    const whereClause: any = { isActive: true };
    if (categoryId) {
      whereClause.propertyCategoryId = parseInt(categoryId as string);
    }

    const subCategories = await prisma.nrPropertySubCategoryMaster.findMany({
      where: whereClause,
      select: {
        subCategoryId: true,
        subCategoryNumber: true,
        subCategoryName: true,
        propertyCategoryId: true,
      },
      orderBy: { subCategoryNumber: 'asc' },
    });

    res.json(subCategories);
  } catch (error) {
    console.error('Error fetching NR property sub-categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getConstructionNatures = async (req: Request, res: Response) => {
  try {
    const constructionNatures = await prisma.constructionNatureMaster.findMany({
      where: { isActive: true },
      select: {
        constructionNatureId: true,
        constructionNatureName: true,
        description: true,
      },
      orderBy: { constructionNatureName: 'asc' },
    });

    res.json(constructionNatures);
  } catch (error) {
    console.error('Error fetching construction natures:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOccupancyStatuses = async (req: Request, res: Response) => {
  try {
    const occupancyStatuses = await prisma.occupancyStatusMaster.findMany({
      where: { isActive: true },
      select: {
        occupancyStatusId: true,
        occupancyStatusName: true,
        description: true,
      },
      orderBy: { occupancyStatusName: 'asc' },
    });

    res.json(occupancyStatuses);
  } catch (error) {
    console.error('Error fetching occupancy statuses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSurveyTypes = async (req: Request, res: Response) => {
  try {
    const surveyTypes = await prisma.surveyTypeMaster.findMany({
      where: { isActive: true },
      select: {
        surveyTypeId: true,
        surveyTypeName: true,
        description: true,
      },
      orderBy: { surveyTypeName: 'asc' },
    });

    res.json(surveyTypes);
  } catch (error) {
    console.error('Error fetching survey types:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllMasterData = async (req: Request, res: Response) => {
  try {
    const [
      responseTypes,
      propertyTypes,
      respondentStatuses,
      roadTypes,
      constructionTypes,
      waterSources,
      disposalTypes,
      floors,
      nrPropertyCategories,
      constructionNatures,
      occupancyStatuses,
      surveyTypes,
    ] = await Promise.all([
      prisma.responseTypeMaster.findMany({
        where: { isActive: true },
        select: { responseTypeId: true, responseTypeName: true },
        orderBy: { responseTypeName: 'asc' },
      }),
      prisma.propertyTypeMaster.findMany({
        where: { isActive: true },
        select: { propertyTypeId: true, propertyTypeName: true },
        orderBy: { propertyTypeName: 'asc' },
      }),
      prisma.respondentStatusMaster.findMany({
        where: { isActive: true },
        select: { respondentStatusId: true, respondentStatusName: true },
        orderBy: { respondentStatusName: 'asc' },
      }),
      prisma.roadTypeMaster.findMany({
        where: { isActive: true },
        select: { roadTypeId: true, roadTypeName: true },
        orderBy: { roadTypeName: 'asc' },
      }),
      prisma.constructionTypeMaster.findMany({
        where: { isActive: true },
        select: { constructionTypeId: true, constructionTypeName: true },
        orderBy: { constructionTypeName: 'asc' },
      }),
      prisma.waterSourceMaster.findMany({
        where: { isActive: true },
        select: { waterSourceId: true, waterSourceName: true },
        orderBy: { waterSourceName: 'asc' },
      }),
      prisma.disposalTypeMaster.findMany({
        where: { isActive: true },
        select: { disposalTypeId: true, disposalTypeName: true },
        orderBy: { disposalTypeName: 'asc' },
      }),
      prisma.floorMaster.findMany({
        where: { isActive: true },
        select: { floorNumberId: true, floorNumberName: true },
        orderBy: { floorNumberId: 'asc' },
      }),
      prisma.nrPropertyCategoryMaster.findMany({
        where: { isActive: true },
        select: { propertyCategoryId: true, propertyCategoryName: true },
        orderBy: { propertyCategoryNumber: 'asc' },
      }),
      prisma.constructionNatureMaster.findMany({
        where: { isActive: true },
        select: { constructionNatureId: true, constructionNatureName: true },
        orderBy: { constructionNatureName: 'asc' },
      }),
      prisma.occupancyStatusMaster.findMany({
        where: { isActive: true },
        select: { occupancyStatusId: true, occupancyStatusName: true },
        orderBy: { occupancyStatusName: 'asc' },
      }),
      prisma.surveyTypeMaster.findMany({
        where: { isActive: true },
        select: { surveyTypeId: true, surveyTypeName: true },
        orderBy: { surveyTypeName: 'asc' },
      }),
    ]);

    res.json({
      responseTypes,
      propertyTypes,
      respondentStatuses,
      roadTypes,
      constructionTypes,
      waterSources,
      disposalTypes,
      floors,
      nrPropertyCategories,
      constructionNatures,
      occupancyStatuses,
      surveyTypes,
    });
  } catch (error) {
    console.error('Error fetching all master data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 