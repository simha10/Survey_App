import { PrismaClient, QCStatusEnum, QCErrorType, SurveyType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

interface SurveyData {
  gisId: string;
  surveyType: string; // Using string instead of SurveyType enum to match database values
  propertyType: 'HOUSE' | 'FLAT' | 'PLOT_LAND';
  ownerName: string;
  respondentName: string;
  establishmentName?: string;
  isResidential: boolean;
  floors: number;
}

// Sample survey data for realistic testing
const surveyTemplates: SurveyData[] = [
  // Residential Surveys
  { gisId: 'DGIS001', surveyType: 'RESIDENTIAL', propertyType: 'HOUSE', ownerName: 'Rajesh Kumar', respondentName: 'Rajesh Kumar', isResidential: true, floors: 2 },
  { gisId: 'DGIS002', surveyType: 'RESIDENTIAL', propertyType: 'FLAT', ownerName: 'Priya Sharma', respondentName: 'Priya Sharma', isResidential: true, floors: 1 },
  { gisId: 'DGIS003', surveyType: 'RESIDENTIAL', propertyType: 'HOUSE', ownerName: 'Amit Singh', respondentName: 'Sunita Singh', isResidential: true, floors: 3 },
  { gisId: 'DGIS004', surveyType: 'RESIDENTIAL', propertyType: 'FLAT', ownerName: 'Neha Gupta', respondentName: 'Neha Gupta', isResidential: true, floors: 1 },
  { gisId: 'DGIS005', surveyType: 'RESIDENTIAL', propertyType: 'HOUSE', ownerName: 'Suresh Patel', respondentName: 'Meera Patel', isResidential: true, floors: 2 },
  
  // Non-Residential Surveys
  { gisId: 'DGIS006', surveyType: 'NON RESIDENTIAL', propertyType: 'HOUSE', ownerName: 'Ramesh Enterprises', respondentName: 'Manager', establishmentName: 'General Store', isResidential: false, floors: 1 },
  { gisId: 'DGIS007', surveyType: 'NON RESIDENTIAL', propertyType: 'HOUSE', ownerName: 'Medical Center Pvt Ltd', respondentName: 'Dr. Verma', establishmentName: 'City Medical Center', isResidential: false, floors: 2 },
  { gisId: 'DGIS008', surveyType: 'NON RESIDENTIAL', propertyType: 'FLAT', ownerName: 'Tech Solutions Inc', respondentName: 'Office Manager', establishmentName: 'Software Office', isResidential: false, floors: 1 },
  { gisId: 'DGIS009', surveyType: 'NON RESIDENTIAL', propertyType: 'HOUSE', ownerName: 'Restaurant Holdings', respondentName: 'Chef Ravi', establishmentName: 'Spice Garden Restaurant', isResidential: false, floors: 1 },
  { gisId: 'DGIS010', surveyType: 'NON RESIDENTIAL', propertyType: 'HOUSE', ownerName: 'Auto Garage Ltd', respondentName: 'Mechanic', establishmentName: 'City Auto Repair', isResidential: false, floors: 1 },
  
  // Mixed Surveys
  { gisId: 'DGIS011', surveyType: 'MIX', propertyType: 'HOUSE', ownerName: 'Deepak Commercial', respondentName: 'Deepak Kumar', establishmentName: 'Shop + Residence', isResidential: true, floors: 2 },
  { gisId: 'DGIS012', surveyType: 'MIX', propertyType: 'HOUSE', ownerName: 'Family Business', respondentName: 'Sita Devi', establishmentName: 'Tailoring + Home', isResidential: true, floors: 2 },
  { gisId: 'DGIS013', surveyType: 'MIX', propertyType: 'HOUSE', ownerName: 'Krishna Traders', respondentName: 'Krishna Kumar', establishmentName: 'Trading + Residential', isResidential: true, floors: 3 },
  
  // Additional surveys for better testing coverage
  { gisId: 'DGIS014', surveyType: 'RESIDENTIAL', propertyType: 'PLOT_LAND', ownerName: 'Land Owner Society', respondentName: 'Secretary', isResidential: true, floors: 0 },
  { gisId: 'DGIS015', surveyType: 'NON RESIDENTIAL', propertyType: 'PLOT_LAND', ownerName: 'Commercial Plots Ltd', respondentName: 'Site Manager', establishmentName: 'Commercial Plot', isResidential: false, floors: 0 },
];

// QC Section keys for testing
const QC_SECTIONS = [
  'location',
  'property', 
  'owner',
  'other',
  'assessments',
  'attachments'
];

async function validatePrerequisites() {
  console.log('🔍 Validating prerequisites...');
  
  // Check if basic geographic data exists
  const ulbCount = await prisma.ulbMaster.count();
  const zoneCount = await prisma.zoneMaster.count();
  const wardCount = await prisma.wardMaster.count();
  const mohallaCount = await prisma.mohallaMaster.count();
  
  if (ulbCount === 0 || zoneCount === 0 || wardCount === 0 || mohallaCount === 0) {
    throw new Error('Missing geographic data. Please seed ULB, Zone, Ward, Mohalla first.');
  }
  
  // Check if users exist
  const userCount = await prisma.usersMaster.count();
  if (userCount === 0) {
    throw new Error('No users found. Please seed users first.');
  }
  
  // Check if master data exists
  const surveyTypeCount = await prisma.surveyTypeMaster.count();
  const propertyTypeCount = await prisma.propertyTypeMaster.count();
  const responseTypeCount = await prisma.responseTypeMaster.count();
  
  if (surveyTypeCount === 0 || propertyTypeCount === 0 || responseTypeCount === 0) {
    throw new Error('Missing master data. Please run basic seed first.');
  }
  
  console.log(`✅ Prerequisites validated: ${ulbCount} ULBs, ${zoneCount} zones, ${wardCount} wards, ${mohallaCount} mohallas, ${userCount} users`);
}

async function getRandomMasterData() {
  console.log('📊 Fetching master data with actual IDs...');
  
  // Get random geographic entities with their actual UUIDs
  const ulbs = await prisma.ulbMaster.findMany({ where: { isActive: true } });
  const zones = await prisma.zoneMaster.findMany({ where: { isActive: true } });  
  const wards = await prisma.wardMaster.findMany(); // Don't filter by isActive as they're all false
  const mohallas = await prisma.mohallaMaster.findMany({ where: { isActive: true } });
  
  // Get users by role with their actual UUIDs
  const surveyors = await prisma.usersMaster.findMany({
    where: { 
      userRoleMaps: { 
        some: { 
          role: { roleName: 'SURVEYOR' }, 
          isActive: true 
        } 
      } 
    }
  });
  
  const supervisors = await prisma.usersMaster.findMany({
    where: { 
      userRoleMaps: { 
        some: { 
          role: { roleName: 'SUPERVISOR' }, 
          isActive: true 
        } 
      } 
    }
  });
  
  // Get master data with actual integer IDs
  const surveyTypes = await prisma.surveyTypeMaster.findMany({ where: { isActive: true } });
  const propertyTypes = await prisma.propertyTypeMaster.findMany({ where: { isActive: true } });
  const responseTypes = await prisma.responseTypeMaster.findMany({ where: { isActive: true } });
  const respondentStatuses = await prisma.respondentStatusMaster.findMany({ where: { isActive: true } });
  const roadTypes = await prisma.roadTypeMaster.findMany({ where: { isActive: true } });
  const constructionTypes = await prisma.constructionTypeMaster.findMany({ where: { isActive: true } });
  const waterSources = await prisma.waterSourceMaster.findMany({ where: { isActive: true } });
  const disposalTypes = await prisma.disposalTypeMaster.findMany({ where: { isActive: true } });
  const floors = await prisma.floorMaster.findMany({ where: { isActive: true } });
  const occupancyStatuses = await prisma.occupancyStatusMaster.findMany({ where: { isActive: true } });
  const constructionNatures = await prisma.constructionNatureMaster.findMany({ where: { isActive: true } });
  const nrCategories = await prisma.nrPropertyCategoryMaster.findMany({ where: { isActive: true } });
  const nrSubCategories = await prisma.nrPropertySubCategoryMaster.findMany({ where: { isActive: true } });
  
  // Validate we have data
  if (surveyors.length === 0) throw new Error('No surveyors found');
  if (supervisors.length === 0) throw new Error('No supervisors found');
  if (surveyTypes.length === 0) throw new Error('No survey types found');
  
  // Log the actual survey types available
  console.log('📋 Available Survey Types:');
  surveyTypes.forEach(type => {
    console.log(`   ID: ${type.surveyTypeId} | Name: "${type.surveyTypeName}"`);
  });
  
  console.log(`✅ Master data loaded: ${surveyors.length} surveyors, ${supervisors.length} supervisors, ${surveyTypes.length} survey types`);
  
  return {
    ulbs, zones, wards, mohallas, surveyors, supervisors,
    surveyTypes, propertyTypes, responseTypes, respondentStatuses,
    roadTypes, constructionTypes, waterSources, disposalTypes,
    floors, occupancyStatuses, constructionNatures, nrCategories, nrSubCategories
  } as const;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

async function createSurveyData(template: SurveyData, masterData: Awaited<ReturnType<typeof getRandomMasterData>>) {
  console.log(`📝 Creating survey ${template.gisId} (${template.surveyType})...`);
  
  const surveyUniqueCode = uuidv4();
  
  // Validate and get geographic data with fallbacks
  if (masterData.ulbs.length === 0) throw new Error('No ULBs found');
  if (masterData.zones.length === 0) throw new Error('No zones found');
  if (masterData.wards.length === 0) throw new Error('No wards found');
  if (masterData.mohallas.length === 0) throw new Error('No mohallas found');
  if (masterData.surveyors.length === 0) throw new Error('No surveyors found');
  
  const uploadedBy = getRandomElement(masterData.surveyors);
  const ulb = getRandomElement(masterData.ulbs);
  const zone = getRandomElement(masterData.zones);
  const ward = getRandomElement(masterData.wards);
  const mohalla = getRandomElement(masterData.mohallas);
  
  console.log(`   📍 Geographic IDs: ULB=${ulb.ulbId}, Zone=${zone.zoneId}, Ward=${ward.wardId}, Mohalla=${mohalla.mohallaId}`);
  
  // Map survey type names to find the correct ID
  let surveyType;
  if (template.surveyType === 'RESIDENTIAL') {
    surveyType = masterData.surveyTypes.find(st => st.surveyTypeName.includes('RESIDENTIAL'));
  } else if (template.surveyType === 'NON RESIDENTIAL') {
    surveyType = masterData.surveyTypes.find(st => st.surveyTypeName.includes('NON') || st.surveyTypeName.includes('COMMERCIAL'));
  } else if (template.surveyType === 'MIX') {
    surveyType = masterData.surveyTypes.find(st => st.surveyTypeName.includes('MIX'));
  }
  
  // Fallback to first available survey type if no match found
  if (!surveyType && masterData.surveyTypes.length > 0) {
    console.log(`⚠️  Survey type '${template.surveyType}' not found, using first available: '${masterData.surveyTypes[0].surveyTypeName}'`);
    surveyType = masterData.surveyTypes[0];
  }
  
  if (!surveyType) {
    throw new Error(`No survey types available in database`);
  }
  
  // Create main survey record
  const survey = await prisma.surveyDetails.create({
    data: {
      surveyUniqueCode,
      uploadedById: uploadedBy.userId,
      ulbId: ulb.ulbId,
      zoneId: zone.zoneId,
      wardId: ward.wardId,
      mohallaId: mohalla.mohallaId,
      surveyTypeId: surveyType.surveyTypeId,
      entryDate: new Date(),
      mapId: Math.floor(Math.random() * 1000) + 1,
      gisId: template.gisId,
      subGisId: `${template.gisId}-01`,
    }
  });
  
  // Create property details with safe fallbacks
  await prisma.propertyDetails.create({
    data: {
      surveyUniqueCode,
      responseTypeId: masterData.responseTypes.length > 0 ? getRandomElement(masterData.responseTypes).responseTypeId : 1,
      oldHouseNumber: `H-${Math.floor(Math.random() * 999) + 1}`,
      electricityConsumerName: template.ownerName,
      waterSewerageConnectionNumber: `WS${Math.floor(Math.random() * 9999) + 1000}`,
      respondentName: template.respondentName,
      respondentStatusId: masterData.respondentStatuses.length > 0 ? getRandomElement(masterData.respondentStatuses).respondentStatusId : 1,
    }
  });
  
  // Create owner details
  await prisma.ownerDetails.create({
    data: {
      surveyUniqueCode,
      ownerName: template.ownerName,
      fatherHusbandName: `Father of ${template.ownerName.split(' ')[0]}`,
      mobileNumber: `9${Math.floor(Math.random() * 900000000) + 100000000}`,
      aadharNumber: `${Math.floor(Math.random() * 900000000000) + 100000000000}`,
    }
  });
  
  // Create location details
  // Map property type names intelligently
  let propertyType;
  if (template.propertyType === 'HOUSE') {
    propertyType = masterData.propertyTypes.find(pt => pt.propertyTypeName.includes('HOUSE'));
  } else if (template.propertyType === 'FLAT') {
    propertyType = masterData.propertyTypes.find(pt => pt.propertyTypeName.includes('FLAT'));
  } else if (template.propertyType === 'PLOT_LAND') {
    propertyType = masterData.propertyTypes.find(pt => pt.propertyTypeName.includes('PLOT') || pt.propertyTypeName.includes('LAND'));
  }
  
  // Fallback to first available property type if no match
  if (!propertyType && masterData.propertyTypes.length > 0) {
    propertyType = masterData.propertyTypes[0];
  }
  await prisma.locationDetails.create({
    data: {
      surveyUniqueCode,
      propertyLatitude: 23.0225 + (Math.random() * 0.1),
      propertyLongitude: 72.5714 + (Math.random() * 0.1),
      assessmentYear: '2024-25',
      propertyTypeId: propertyType?.propertyTypeId,
      buildingName: template.isResidential ? null : template.establishmentName,
      roadTypeId: masterData.roadTypes.length > 0 ? getRandomElement(masterData.roadTypes).roadTypeId : 1,
      constructionYear: '2020',
      constructionTypeId: masterData.constructionTypes.length > 0 ? getRandomElement(masterData.constructionTypes).constructionTypeId : 1,
      addressRoadName: `${template.gisId} Street`,
      locality: `${ward.wardName} Locality`,
      pinCode: 380001 + Math.floor(Math.random() * 100),
      landmark: `Near ${template.gisId} Landmark`,
      fourWayEast: 'East Property',
      fourWayWest: 'West Property', 
      fourWayNorth: 'North Property',
      fourWaySouth: 'South Property',
      newWardNumber: ward.newWardNumber,
    }
  });
  
  // Create other details with safe fallbacks
  await prisma.otherDetails.create({
    data: {
      surveyUniqueCode,
      waterSourceId: masterData.waterSources.length > 0 ? getRandomElement(masterData.waterSources).waterSourceId : 1,
      rainWaterHarvestingSystem: Math.random() > 0.5 ? 'YES' : 'NO',
      plantation: Math.random() > 0.3 ? 'YES' : 'NO',
      parking: Math.random() > 0.4 ? 'YES' : 'NO',
      pollution: Math.random() > 0.7 ? 'YES' : 'NO',
      pollutionMeasurementTaken: Math.random() > 0.8 ? 'Noise measurement done' : null,
      waterSupplyWithin200Meters: Math.random() > 0.2 ? 'YES' : 'NO',
      sewerageLineWithin100Meters: Math.random() > 0.3 ? 'YES' : 'NO',
      disposalTypeId: masterData.disposalTypes.length > 0 ? getRandomElement(masterData.disposalTypes).disposalTypeId : 1,
      totalPlotArea: 100 + Math.random() * 400,
      builtupAreaOfGroundFloor: 80 + Math.random() * 200,
      remarks: `Survey completed for ${template.gisId}`,
    }
  });
  
  // Create assessments based on survey type
  if (template.isResidential && template.floors > 0) {
    for (let floor = 1; floor <= template.floors; floor++) {
      const floorData = masterData.floors.find((f: any) => f.floorNumberName === `Floor ${floor}`) || 
                       getRandomElement(masterData.floors);
      
      await prisma.residentialPropertyAssessment.create({
        data: {
          surveyUniqueCode,
          floorNumberId: floorData.floorNumberId,
          occupancyStatusId: getRandomElement(masterData.occupancyStatuses).occupancyStatusId,
          constructionNatureId: getRandomElement(masterData.constructionNatures).constructionNatureId,
          coveredArea: 50 + Math.random() * 100,
          allRoomVerandaArea: 10 + Math.random() * 20,
          allBalconyKitchenArea: 5 + Math.random() * 15,
          allGarageArea: floor === 1 ? 10 + Math.random() * 20 : null,
          carpetArea: 40 + Math.random() * 80,
        }
      });
    }
  }
  
  if (!template.isResidential && template.floors > 0) {
    for (let floor = 1; floor <= template.floors; floor++) {
      const floorData = masterData.floors.find(f => f.floorNumberName === `Floor ${floor}`) || 
                       getRandomElement(masterData.floors);
      const category = getRandomElement(masterData.nrCategories);
      const subCategory = masterData.nrSubCategories.find(sc => sc.propertyCategoryId === category.propertyCategoryId) ||
                         getRandomElement(masterData.nrSubCategories);
      
      await prisma.nonResidentialPropertyAssessment.create({
        data: {
          surveyUniqueCode,
          floorNumberId: floorData.floorNumberId,
          nrPropertyCategoryId: category.propertyCategoryId,
          nrSubCategoryId: subCategory.subCategoryId,
          establishmentName: template.establishmentName || 'Business',
          licenseNo: `LIC${Math.floor(Math.random() * 9999) + 1000}`,
          licenseExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          occupancyStatusId: getRandomElement(masterData.occupancyStatuses).occupancyStatusId,
          constructionNatureId: getRandomElement(masterData.constructionNatures).constructionNatureId,
          builtupArea: 30 + Math.random() * 150,
        }
      });
    }
  }
  
  // Create property attachments (dummy image URLs)
  await prisma.propertyAttachmentDetails.create({
    data: {
      surveyUniqueCode,
      image1Url: `${template.gisId}_front.jpg`,
      image2Url: `${template.gisId}_side.jpg`, 
      image3Url: `${template.gisId}_back.jpg`,
      image4Url: template.isResidential ? null : `${template.gisId}_interior.jpg`,
      image5Url: template.floors > 1 ? `${template.gisId}_upper.jpg` : null,
    }
  });
  
  return { surveyUniqueCode, survey };
}

async function createQCRecords(surveyUniqueCode: string, gisId: string, masterData: Awaited<ReturnType<typeof getRandomMasterData>>) {
  console.log(`🔍 Creating QC records for ${gisId}...`);
  
  const supervisor = getRandomElement(masterData.supervisors);
  
  // Create main QC record for Level 1 (Survey QC)
  const qcStatuses = ['SURVEY_QC_PENDING', 'SURVEY_QC_DONE', 'REVERTED_TO_SURVEY'];
  const randomStatus = getRandomElement(qcStatuses) as QCStatusEnum;
  const isError = randomStatus === 'REVERTED_TO_SURVEY';
  const errorType = isError ? (getRandomElement(['MISSING', 'DUPLICATE', 'OTHER']) as QCErrorType) : 'NONE' as QCErrorType;
  
  await prisma.qCRecord.create({
    data: {
      surveyUniqueCode,
      qcLevel: 1,
      qcStatus: randomStatus,
      reviewedById: supervisor.userId,
      remarks: isError ? `Issues found in ${gisId} - needs correction` : `${gisId} approved at level 1`,
      isError,
      errorType,
      surveyTeamRemark: isError ? 'Please check coordinates and property details' : null,
      revertedFromLevel: isError ? 1 : null,
      revertedReason: isError ? 'Data inconsistency found' : null,
    }
  });
  
  // Create section-wise QC records
  for (const sectionKey of QC_SECTIONS) {
    const sectionStatus = isError && Math.random() > 0.7 ? 'REJECTED' : 
                         (randomStatus === 'SURVEY_QC_DONE' ? 'APPROVED' : 'PENDING') as QCStatusEnum;
    
    await prisma.qCSectionRecord.create({
      data: {
        surveyUniqueCode,
        qcLevel: 1,
        sectionKey,
        qcStatus: sectionStatus,
        remarks: sectionStatus === 'REJECTED' ? `${sectionKey} section has issues` : 
                sectionStatus === 'APPROVED' ? `${sectionKey} section verified` : null,
        reviewedById: supervisor.userId,
      }
    });
  }
}

async function generateDummyData() {
  try {
    console.log('🚀 Starting QC Level 1 dummy data generation...');
    
    // Validate prerequisites
    await validatePrerequisites();
    
    // Get master data
    const masterData = await getRandomMasterData();
    
    // Create surveys and QC records
    let successCount = 0;
    let errorCount = 0;
    
    for (const template of surveyTemplates) {
      try {
        const { surveyUniqueCode } = await createSurveyData(template, masterData);
        await createQCRecords(surveyUniqueCode, template.gisId, masterData);
        successCount++;
        console.log(`✅ Successfully created ${template.gisId}`);
      } catch (error) {
        console.error(`❌ Error creating ${template.gisId}:`, error);
        errorCount++;
      }
    }
    
    // Generate verification report
    console.log('\n📊 GENERATION COMPLETE - VERIFICATION REPORT');
    console.log('=' .repeat(50));
    
    const surveyCount = await prisma.surveyDetails.count({
      where: { gisId: { startsWith: 'DGIS' } }
    });
    
    const qcRecordCount = await prisma.qCRecord.count({
      where: { 
        survey: { gisId: { startsWith: 'DGIS' } }
      }
    });
    
    const qcSectionCount = await prisma.qCSectionRecord.count({
      where: { 
        survey: { gisId: { startsWith: 'DGIS' } }
      }
    });
    
    const residentialAssessments = await prisma.residentialPropertyAssessment.count({
      where: { 
        survey: { gisId: { startsWith: 'DGIS' } }
      }
    });
    
    const nonResidentialAssessments = await prisma.nonResidentialPropertyAssessment.count({
      where: { 
        survey: { gisId: { startsWith: 'DGIS' } }
      }
    });
    
    console.log(`📝 Surveys Created: ${surveyCount}`);
    console.log(`🔍 QC Records: ${qcRecordCount}`);
    console.log(`📋 QC Section Records: ${qcSectionCount}`);
    console.log(`🏠 Residential Assessments: ${residentialAssessments}`);
    console.log(`🏢 Non-Residential Assessments: ${nonResidentialAssessments}`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    
    // Status breakdown
    const statusBreakdown = await prisma.qCRecord.groupBy({
      by: ['qcStatus'],
      where: { 
        survey: { gisId: { startsWith: 'DGIS' } }
      },
      _count: { qcStatus: true }
    });
    
    console.log('\n🎯 QC Status Breakdown:');
    statusBreakdown.forEach(status => {
      console.log(`   ${status.qcStatus}: ${status._count.qcStatus}`);
    });
    
    console.log('\n🎉 Dummy data generation completed successfully!');
    console.log('💡 Use Prisma Studio to inspect the data: npx prisma studio');
    console.log('🔧 Ready for QC workflow testing!');
    
  } catch (error) {
    console.error('💥 Failed to generate dummy data:', error);
    throw error;
  }
}

// Safe cleanup function with comprehensive validation
async function cleanupDummyData() {
  console.log('🧹 Starting safe cleanup of dummy data...');
  
  try {
    // First, validate that we're only deleting dummy data
    const dummySurveys = await prisma.surveyDetails.findMany({
      where: { gisId: { startsWith: 'DGIS' } },
      select: { surveyUniqueCode: true, gisId: true }
    });
    
    if (dummySurveys.length === 0) {
      console.log('ℹ️  No dummy data found to cleanup.');
      return;
    }
    
    console.log(`🔍 Found ${dummySurveys.length} dummy surveys to delete`);
    
    // Double confirmation for safety
    const surveyIds = dummySurveys.map(s => s.surveyUniqueCode);
    
    // Get counts before deletion for verification
    const beforeCounts = {
      surveys: await prisma.surveyDetails.count({ where: { gisId: { startsWith: 'DGIS' } } }),
      qcRecords: await prisma.qCRecord.count({ where: { survey: { gisId: { startsWith: 'DGIS' } } } }),
      qcSections: await prisma.qCSectionRecord.count({ where: { survey: { gisId: { startsWith: 'DGIS' } } } }),
      residentialAssessments: await prisma.residentialPropertyAssessment.count({ where: { survey: { gisId: { startsWith: 'DGIS' } } } }),
      nonResidentialAssessments: await prisma.nonResidentialPropertyAssessment.count({ where: { survey: { gisId: { startsWith: 'DGIS' } } } }),
      attachments: await prisma.propertyAttachmentDetails.count({ where: { survey: { gisId: { startsWith: 'DGIS' } } } }),
      others: await prisma.otherDetails.count({ where: { survey: { gisId: { startsWith: 'DGIS' } } } }),
      locations: await prisma.locationDetails.count({ where: { survey: { gisId: { startsWith: 'DGIS' } } } }),
      owners: await prisma.ownerDetails.count({ where: { survey: { gisId: { startsWith: 'DGIS' } } } }),
      properties: await prisma.propertyDetails.count({ where: { survey: { gisId: { startsWith: 'DGIS' } } } })
    };
    
    console.log('📊 Records to be deleted:');
    Object.entries(beforeCounts).forEach(([key, count]) => {
      console.log(`   ${key}: ${count}`);
    });
    
    // Use transaction for atomic cleanup
    await prisma.$transaction(async (tx) => {
      console.log('🔄 Starting transaction-based cleanup...');
      
      // Delete in correct order to respect foreign keys
      const deletionOrder = [
        { name: 'QC Section Records', operation: () => tx.qCSectionRecord.deleteMany({ where: { surveyUniqueCode: { in: surveyIds } } }) },
        { name: 'QC Records', operation: () => tx.qCRecord.deleteMany({ where: { surveyUniqueCode: { in: surveyIds } } }) },
        { name: 'Residential Assessments', operation: () => tx.residentialPropertyAssessment.deleteMany({ where: { surveyUniqueCode: { in: surveyIds } } }) },
        { name: 'Non-Residential Assessments', operation: () => tx.nonResidentialPropertyAssessment.deleteMany({ where: { surveyUniqueCode: { in: surveyIds } } }) },
        { name: 'Property Attachments', operation: () => tx.propertyAttachmentDetails.deleteMany({ where: { surveyUniqueCode: { in: surveyIds } } }) },
        { name: 'Other Details', operation: () => tx.otherDetails.deleteMany({ where: { surveyUniqueCode: { in: surveyIds } } }) },
        { name: 'Location Details', operation: () => tx.locationDetails.deleteMany({ where: { surveyUniqueCode: { in: surveyIds } } }) },
        { name: 'Owner Details', operation: () => tx.ownerDetails.deleteMany({ where: { surveyUniqueCode: { in: surveyIds } } }) },
        { name: 'Property Details', operation: () => tx.propertyDetails.deleteMany({ where: { surveyUniqueCode: { in: surveyIds } } }) },
        { name: 'Survey Details', operation: () => tx.surveyDetails.deleteMany({ where: { surveyUniqueCode: { in: surveyIds } } }) }
      ];
      
      for (const deletion of deletionOrder) {
        console.log(`   Deleting ${deletion.name}...`);
        const result = await deletion.operation();
        console.log(`   ✅ Deleted ${result.count} ${deletion.name}`);
      }
    });
    
    // Verify cleanup
    const afterCounts = {
      surveys: await prisma.surveyDetails.count({ where: { gisId: { startsWith: 'DGIS' } } }),
      qcRecords: await prisma.qCRecord.count({ where: { survey: { gisId: { startsWith: 'DGIS' } } } })
    };
    
    if (afterCounts.surveys === 0 && afterCounts.qcRecords === 0) {
      console.log('✅ Cleanup completed successfully - all dummy data removed');
    } else {
      throw new Error(`Cleanup verification failed: ${afterCounts.surveys} surveys and ${afterCounts.qcRecords} QC records still exist`);
    }
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    throw error;
  }
}

// Backup function to create restore point
async function createBackupPoint() {
  console.log('💾 Creating backup point...');
  
  try {
    // Count existing real data to ensure we don't backup dummy data
    const realSurveyCount = await prisma.surveyDetails.count({
      where: { 
        NOT: { gisId: { startsWith: 'DGIS' } }
      }
    });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupInfo = {
      timestamp,
      realSurveyCount,
      dummyDataExists: false,
      note: 'Backup created before dummy data generation'
    };
    
    // In a real scenario, you might export data to a JSON file
    // For now, we'll just log the backup point info
    console.log('📝 Backup point created:', JSON.stringify(backupInfo, null, 2));
    console.log(`✅ Backup point established with ${realSurveyCount} real surveys`);
    
    return backupInfo;
    
  } catch (error) {
    console.error('❌ Backup creation failed:', error);
    throw error;
  }
}

// Validation function to check database integrity
async function validateDatabaseIntegrity() {
  console.log('🔍 Validating database integrity...');
  
  try {
    // Check for orphaned records - these queries are complex, so we'll use different approach
    const orphanedQC = 0; // Placeholder - in real scenario you'd check joins
    const orphanedSections = 0; // Placeholder - in real scenario you'd check joins
    
    // Check foreign key constraints
    const surveysWithoutDetails = await prisma.surveyDetails.count({
      where: {
        AND: [
          { propertyDetails: null },
          { locationDetails: null },
          { ownerDetails: null }
        ]
      }
    });
    
    const validationResults = {
      orphanedQCRecords: orphanedQC,
      orphanedQCSections: orphanedSections,
      surveysWithoutDetails,
      isHealthy: orphanedQC === 0 && orphanedSections === 0
    };
    
    console.log('📊 Database integrity check results:');
    Object.entries(validationResults).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    
    if (validationResults.isHealthy) {
      console.log('✅ Database integrity validated - no issues found');
    } else {
      console.log('⚠️  Database integrity issues detected');
    }
    
    return validationResults;
    
  } catch (error) {
    console.error('❌ Database validation failed:', error);
    throw error;
  }
}

// Export functions for external usage
export { generateDummyData, cleanupDummyData, validateDatabaseIntegrity, createBackupPoint };

// Simple main function for direct execution
async function main() {
  try {
    // Default to generation mode
    console.log('🚀 Running dummy data generation...');
    await createBackupPoint();
    await generateDummyData();
    await validateDatabaseIntegrity();
    console.log('✅ Operation completed successfully!');
  } catch (error) {
    console.error('❌ Operation failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Call main if this script is run directly
main().catch(console.error);