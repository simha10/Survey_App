import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedQCWorkflow() {
  console.log('🔄 Starting QC Workflow Database Setup...');

  try {
    // Try different possible model names for QCLevelMaster
    let qcLevelModel: any;
    let qcErrorTypeModel: any;

    // Check which model names exist
    if ('qcLevelMaster' in prisma) {
      qcLevelModel = prisma.qcLevelMaster;
      console.log('✅ Found model: qcLevelMaster');
    } else if ('qCLevelMaster' in prisma) {
      qcLevelModel = prisma.qCLevelMaster;
      console.log('✅ Found model: qCLevelMaster');
    } else if ('QCLevelMaster' in prisma) {
      qcLevelModel = (prisma as any).QCLevelMaster;
      console.log('✅ Found model: QCLevelMaster');
    } else {
      console.log('❌ QCLevelMaster model not found. Available models:');
      console.log(Object.getOwnPropertyNames(prisma).filter(name => !name.startsWith('_') && !name.startsWith('$')));
      throw new Error('QCLevelMaster model not found');
    }

    // Check which model names exist for QCErrorTypeMaster
    if ('qcErrorTypeMaster' in prisma) {
      qcErrorTypeModel = prisma.qcErrorTypeMaster;
      console.log('✅ Found model: qcErrorTypeMaster');
    } else if ('qCErrorTypeMaster' in prisma) {
      qcErrorTypeModel = prisma.qCErrorTypeMaster;
      console.log('✅ Found model: qCErrorTypeMaster');
    } else if ('QCErrorTypeMaster' in prisma) {
      qcErrorTypeModel = (prisma as any).QCErrorTypeMaster;
      console.log('✅ Found model: QCErrorTypeMaster');
    } else {
      console.log('❌ QCErrorTypeMaster model not found');
      throw new Error('QCErrorTypeMaster model not found');
    }

    // 1. Seed QC Levels (Phase 1: Levels 1 & 2)
    console.log('➤ Creating QC Levels...');
    const qcLevels = [
      { 
        qcLevelId: 1, 
        levelName: 'Survey QC', 
        description: 'Level 1 QC - Initial review by Supervisor',
        isActive: true
      },
      { 
        qcLevelId: 2, 
        levelName: 'In-Office QC', 
        description: 'Level 2 QC - Secondary review by Admin with bulk actions',
        isActive: true
      },
      { 
        qcLevelId: 3, 
        levelName: 'RI QC', 
        description: 'Level 3 QC - Revenue Inspector review (Future Phase)',
        isActive: false
      },
      { 
        qcLevelId: 4, 
        levelName: 'Final QC', 
        description: 'Level 4 QC - Final approval (Future Phase)',
        isActive: false
      },
    ];

    await qcLevelModel.createMany({
      data: qcLevels,
      skipDuplicates: true,
    });

    console.log('✅ QC Levels created successfully');

    // 2. Seed QC Error Types
    console.log('➤ Creating QC Error Types...');
    const qcErrorTypes = [
      { 
        errorCode: 'NONE', 
        description: 'No Error - Property data is correct and complete',
        isActive: true
      },
      { 
        errorCode: 'MISS', 
        description: 'Missing Property - Property not found during survey',
        isActive: true
      },
      { 
        errorCode: 'DUP', 
        description: 'Duplicate Property - Property already exists in system',
        isActive: true
      },
      { 
        errorCode: 'DATA', 
        description: 'Data Error - Incorrect or incomplete property data',
        isActive: true
      },
      { 
        errorCode: 'LOC', 
        description: 'Location Error - Incorrect GPS coordinates or address',
        isActive: true
      },
      { 
        errorCode: 'DOC', 
        description: 'Documentation Error - Missing or incorrect documents/images',
        isActive: true
      },
      { 
        errorCode: 'VAL', 
        description: 'Validation Error - Data fails business rule validation',
        isActive: true
      },
      { 
        errorCode: 'OTH', 
        description: 'Other Error - Any other type of error not covered above',
        isActive: true
      },
    ];

    await qcErrorTypeModel.createMany({
      data: qcErrorTypes,
      skipDuplicates: true,
    });

    console.log('✅ QC Error Types created successfully');

    // 3. Verify the data
    const levelCount = await qcLevelModel.count();
    const errorTypeCount = await qcErrorTypeModel.count();
    const activeLevels = await qcLevelModel.findMany({
      where: { isActive: true },
      select: { qcLevelId: true, levelName: true }
    });

    console.log('\n🎉 QC Workflow Database Setup Complete!');
    console.log('═══════════════════════════════════════════');
    console.log(`📊 Total QC Levels: ${levelCount}`);
    console.log(`🔍 Total Error Types: ${errorTypeCount}`);
    
    console.log('\n📋 Active QC Levels (Phase 1):');
    activeLevels.forEach((level: any) => {
      console.log(`   • Level ${level.qcLevelId}: ${level.levelName}`);
    });
    
    console.log('\n🎯 Database is ready for:');
    console.log('   ✅ Backend QC Service Implementation');
    console.log('   ✅ Frontend QC Level Pages');
    console.log('   ✅ Multi-level QC Workflow');
    console.log('   ✅ Supervisor & Admin QC Reviews');
    console.log('   ✅ Bulk QC Actions with Audit Trail');
    
  } catch (error) {
    console.error('❌ Error seeding QC Workflow:', error);
    throw error;
  }
}

// Execute the seeding
seedQCWorkflow()
  .catch((e) => {
    console.error('\n💥 QC Workflow seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\n🔌 Database connection closed');
  });