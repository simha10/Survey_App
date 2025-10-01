import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedQCWorkflow() {
  console.log('🔄 Seeding QC Workflow tables...');

  try {
    // QCLevelMaster - Define QC levels for Phase 1 (Levels 1 and 2)
    const qcLevels = [
      { qcLevelId: 1, levelName: 'Survey QC', description: 'Level 1 QC - Initial review by Supervisor' },
      { qcLevelId: 2, levelName: 'In-Office QC', description: 'Level 2 QC - Secondary review by Admin' },
      { qcLevelId: 3, levelName: 'RI QC', description: 'Level 3 QC - Revenue Inspector review' },
      { qcLevelId: 4, levelName: 'Final QC', description: 'Level 4 QC - Final approval' },
    ];

    await prisma.qCLevelMaster.createMany({
      data: qcLevels.map(level => ({
        qcLevelId: level.qcLevelId,
        levelName: level.levelName,
        description: level.description,
        isActive: true,
      })),
      skipDuplicates: true,
    });

    console.log('✅ QC Levels created successfully');

    // QCErrorTypeMaster - Define error types for QC
    const qcErrorTypes = [
      { errorCode: 'MISS', description: 'Missing Property - Property not found during survey' },
      { errorCode: 'DUP', description: 'Duplicate Property - Property already exists in system' },
      { errorCode: 'DATA', description: 'Data Error - Incorrect or incomplete data' },
      { errorCode: 'LOC', description: 'Location Error - Incorrect GPS coordinates or address' },
      { errorCode: 'DOC', description: 'Documentation Error - Missing or incorrect documents' },
      { errorCode: 'OTH', description: 'Other Error - Any other type of error' },
      { errorCode: 'NONE', description: 'No Error - Property data is correct' },
    ];

    await prisma.qCErrorTypeMaster.createMany({
      data: qcErrorTypes.map(errorType => ({
        errorCode: errorType.errorCode,
        description: errorType.description,
        isActive: true,
      })),
      skipDuplicates: true,
    });

    console.log('✅ QC Error Types created successfully');

    console.log('\n🎉 QC Workflow tables seeded successfully!');
    console.log('📊 QC Levels: Survey QC (L1), In-Office QC (L2), RI QC (L3), Final QC (L4)');
    console.log('🔍 QC Error Types: MISS, DUP, DATA, LOC, DOC, OTH, NONE');

  } catch (error) {
    console.error('❌ Error seeding QC Workflow tables:', error);
    throw error;
  }
}

seedQCWorkflow()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });