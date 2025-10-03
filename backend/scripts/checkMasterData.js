const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 Checking available survey types...');
    const surveyTypes = await prisma.surveyTypeMaster.findMany();
    console.log('Available Survey Types:', surveyTypes.map(t => `"${t.surveyTypeName}"`));
    
    console.log('\n🔍 Checking other master data...');
    const propertyTypes = await prisma.propertyTypeMaster.findMany();
    console.log('Available Property Types:', propertyTypes.map(t => `"${t.propertyTypeName}"`));
    
    const responseTypes = await prisma.responseTypeMaster.findMany();
    console.log('Available Response Types:', responseTypes.map(t => `"${t.responseTypeName}"`));
    
    console.log('\n📊 Master data counts:');
    console.log('Survey Types:', surveyTypes.length);
    console.log('Property Types:', propertyTypes.length);
    console.log('Response Types:', responseTypes.length);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();