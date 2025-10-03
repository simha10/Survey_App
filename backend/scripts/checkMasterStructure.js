const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMasterDataStructure() {
  try {
    console.log('🔍 Checking master data structure and IDs...\n');
    
    // Check Survey Types
    console.log('📋 SURVEY TYPES:');
    const surveyTypes = await prisma.surveyTypeMaster.findMany();
    surveyTypes.forEach(type => {
      console.log(`   ID: ${type.surveyTypeId} | Name: "${type.surveyTypeName}" | Active: ${type.isActive}`);
    });
    
    // Check Property Types  
    console.log('\n🏠 PROPERTY TYPES:');
    const propertyTypes = await prisma.propertyTypeMaster.findMany();
    propertyTypes.forEach(type => {
      console.log(`   ID: ${type.propertyTypeId} | Name: "${type.propertyTypeName}" | Active: ${type.isActive}`);
    });
    
    // Check Response Types
    console.log('\n📝 RESPONSE TYPES:');
    const responseTypes = await prisma.responseTypeMaster.findMany();
    responseTypes.forEach(type => {
      console.log(`   ID: ${type.responseTypeId} | Name: "${type.responseTypeName}" | Active: ${type.isActive}`);
    });
    
    // Check Users with Roles
    console.log('\n👥 USERS WITH ROLES:');
    const users = await prisma.usersMaster.findMany({
      include: {
        userRoleMaps: {
          include: {
            role: true
          },
          where: {
            isActive: true
          }
        }
      }
    });
    
    users.forEach(user => {
      const roles = user.userRoleMaps.map(urm => urm.role.roleName).join(', ');
      console.log(`   ID: ${user.userId} | Username: "${user.username}" | Roles: [${roles}]`);
    });
    
    // Check Geographic Data
    console.log('\n🌍 GEOGRAPHIC DATA:');
    const ulbCount = await prisma.ulbMaster.count();
    const zoneCount = await prisma.zoneMaster.count();
    const wardCount = await prisma.wardMaster.count();
    const mohallaCount = await prisma.mohallaMaster.count();
    
    console.log(`   ULBs: ${ulbCount} | Zones: ${zoneCount} | Wards: ${wardCount} | Mohallas: ${mohallaCount}`);
    
    // Sample of geographic data with IDs
    console.log('\n📍 SAMPLE GEOGRAPHIC IDs:');
    const sampleUlb = await prisma.ulbMaster.findFirst();
    const sampleZone = await prisma.zoneMaster.findFirst();  
    const sampleWard = await prisma.wardMaster.findFirst();
    const sampleMohalla = await prisma.mohallaMaster.findFirst();
    
    if (sampleUlb) console.log(`   Sample ULB: ${sampleUlb.ulbId} | "${sampleUlb.ulbName}"`);
    if (sampleZone) console.log(`   Sample Zone: ${sampleZone.zoneId} | "${sampleZone.zoneName || sampleZone.zoneNumber}"`);
    if (sampleWard) console.log(`   Sample Ward: ${sampleWard.wardId} | "${sampleWard.wardName}"`);
    if (sampleMohalla) console.log(`   Sample Mohalla: ${sampleMohalla.mohallaId} | "${sampleMohalla.mohallaName}"`);
    
  } catch (error) {
    console.error('❌ Error checking master data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMasterDataStructure();