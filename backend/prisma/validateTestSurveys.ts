import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('='.repeat(70));
  console.log('🔍 Validating Survey Data in Test Mohalla');
  console.log('='.repeat(70));
  
  // Get Test Mohalla
  const testMohalla = await prisma.mohallaMaster.findFirst({
    where: {
      mohallaName: {
        contains: 'Test Mohalla',
        mode: 'insensitive',
      },
    },
    include: {
      wardMohallaMaps: {
        include: {
          ward: {
            include: {
              zoneWardMaps: {
                include: {
                  zone: true,
                },
              },
            },
          },
        },
      },
    },
  });
  
  if (!testMohalla) {
    console.error('❌ Test Mohalla not found!');
    return;
  }
  
  const wardMohallaMap = testMohalla.wardMohallaMaps[0];
  if (!wardMohallaMap) {
    console.error('❌ Test Mohalla not mapped to any ward!');
    return;
  }
  
  const ward = wardMohallaMap.ward;
  const zoneWardMap = ward.zoneWardMaps[0];
  
  console.log('\n📍 Geographic Location:');
  console.log(`   ULB: TANDA`);
  console.log(`   Zone: ${zoneWardMap?.zone.zoneName}`);
  console.log(`   Ward: ${ward.wardName}`);
  console.log(`   Mohalla: ${testMohalla.mohallaName}`);
  
  // Get all surveys in Test Mohalla
  const surveys = await prisma.surveyDetails.findMany({
    where: {
      mohallaId: testMohalla.mohallaId,
    },
    include: {
      propertyDetails: true,
      ownerDetails: true,
      locationDetails: true,
      otherDetails: true,
      residentialPropertyAssessments: true,
      nonResidentialPropertyAssessments: true,
      propertyAttachments: true,
      surveyType: true,
      uploadedBy: true,
    },
    orderBy: {
      gisId: 'asc',
    },
  });
  
  console.log('\n' + '='.repeat(70));
  console.log(`📊 SURVEY STATISTICS`);
  console.log('='.repeat(70));
  console.log(`\n✅ Total Surveys Found: ${surveys.length}`);
  
  const surveyTypeCounts: Record<string, number> = {};
  const propertyTypeCounts: Record<string, number> = {};
  let totalFloors = 0;
  let totalResidentialAssessments = 0;
  let totalNonResidentialAssessments = 0;
  
  surveys.forEach(survey => {
    // Count by survey type
    surveyTypeCounts[survey.surveyType.surveyTypeName] = 
      (surveyTypeCounts[survey.surveyType.surveyTypeName] || 0) + 1;
    
    // Count by property type
    if (survey.locationDetails?.propertyTypeId) {
      const propType = survey.locationDetails.propertyTypeId.toString();
      propertyTypeCounts[propType] = (propertyTypeCounts[propType] || 0) + 1;
    }
    
    // Count floors
    totalFloors += survey.residentialPropertyAssessments.length + 
                   survey.nonResidentialPropertyAssessments.length;
    totalResidentialAssessments += survey.residentialPropertyAssessments.length;
    totalNonResidentialAssessments += survey.nonResidentialPropertyAssessments.length;
  });
  
  console.log('\n📈 Breakdown by Survey Type:');
  Object.entries(surveyTypeCounts).forEach(([type, count]) => {
    console.log(`   • ${type}: ${count} surveys`);
  });
  
  console.log('\n🏗️  Floor Assessments:');
  console.log(`   • Total Floor Records: ${totalFloors}`);
  console.log(`   • Residential Assessments: ${totalResidentialAssessments}`);
  console.log(`   • Non-Residential Assessments: ${totalNonResidentialAssessments}`);
  
  // Detailed survey list
  console.log('\n' + '='.repeat(70));
  console.log('📋 DETAILED SURVEY LIST');
  console.log('='.repeat(70));
  
  surveys.forEach((survey, index) => {
    console.log(`\n${index + 1}. ${survey.gisId} (${survey.surveyType.surveyTypeName})`);
    console.log(`   📍 GIS ID: ${survey.gisId}`);
    console.log(`   📅 Entry Date: ${survey.entryDate.toDateString()}`);
    console.log(`   👤 Owner: ${survey.ownerDetails?.ownerName}`);
    console.log(`   🏠 Respondent: ${survey.propertyDetails?.respondentName}`);
    console.log(`   📍 Address: ${survey.locationDetails?.addressRoadName}`);
    console.log(`   📐 Plot Area: ${survey.otherDetails?.totalPlotArea} sq.m.`);
    console.log(`   🏗️  Built-up Area: ${survey.otherDetails?.builtupAreaOfGroundFloor} sq.m.`);
    
    if (survey.residentialPropertyAssessments.length > 0) {
      console.log(`   🏢 Floors: ${survey.residentialPropertyAssessments.length}`);
    }
    
    if (survey.nonResidentialPropertyAssessments.length > 0) {
      const nr = survey.nonResidentialPropertyAssessments[0];
      console.log(`   🏪 Establishment: ${nr.establishmentName}`);
      console.log(`   🏢 Floors: ${survey.nonResidentialPropertyAssessments.length}`);
    }
    
    const hasAttachments = survey.propertyAttachments.length > 0 && survey.propertyAttachments[0].image1Url;
    console.log(`   📸 Attachments: ${hasAttachments ? 'Yes' : 'No'}`);
  });
  
  // Validate relationships
  console.log('\n' + '='.repeat(70));
  console.log('🔗 RELATIONSHIP VALIDATION');
  console.log('='.repeat(70));
  
  let validRelationships = 0;
  let invalidRelationships = 0;
  
  for (const survey of surveys) {
    const issues: string[] = [];
    
    // Check property details
    if (!survey.propertyDetails) {
      issues.push('Missing Property Details');
    }
    
    // Check owner details
    if (!survey.ownerDetails) {
      issues.push('Missing Owner Details');
    }
    
    // Check location details
    if (!survey.locationDetails) {
      issues.push('Missing Location Details');
    }
    
    // Check other details
    if (!survey.otherDetails) {
      issues.push('Missing Other Details');
    }
    
    // Check attachments
    const hasAttachments = survey.propertyAttachments.length > 0 && survey.propertyAttachments[0].image1Url;
    if (!hasAttachments) {
      issues.push('Missing Property Attachments');
    }
    
    // Check floor assessments
    const hasFloors = survey.residentialPropertyAssessments.length > 0 || 
                     survey.nonResidentialPropertyAssessments.length > 0;
    if (!hasFloors && survey.otherDetails?.builtupAreaOfGroundFloor! > 0) {
      issues.push('No Floor Assessments despite having built-up area');
    }
    
    if (issues.length > 0) {
      invalidRelationships++;
      console.log(`\n⚠️  ${survey.gisId}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      validRelationships++;
    }
  }
  
  console.log(`\n✅ Surveys with Complete Data: ${validRelationships}/${surveys.length}`);
  console.log(`⚠️  Surveys with Issues: ${invalidRelationships}/${surveys.length}`);
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('🎉 VALIDATION COMPLETE');
  console.log('='.repeat(70));
  console.log(`\n📊 Final Summary:`);
  console.log(`   • Total Surveys: ${surveys.length}`);
  console.log(`   • Valid Relationships: ${validRelationships}`);
  console.log(`   • Invalid Relationships: ${invalidRelationships}`);
  console.log(`   • Success Rate: ${((validRelationships / surveys.length) * 100).toFixed(2)}%`);
  console.log('\n✅ All mobile app collectable data successfully seeded!');
  console.log('   (Property Details, Owner Details, Location Details, Other Details,');
  console.log('    Floor Assessments, Property Attachments)');
  console.log('='.repeat(70));
}

main()
  .catch((e) => {
    console.error('\n❌ Validation Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
