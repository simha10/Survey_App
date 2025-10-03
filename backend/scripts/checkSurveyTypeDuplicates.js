const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSurveyTypeUsage() {
  try {
    console.log('🔍 Checking survey type usage and duplicates...\n');
    
    // Get all survey types
    const surveyTypes = await prisma.surveyTypeMaster.findMany({
      orderBy: { surveyTypeId: 'asc' }
    });
    
    console.log('📋 ALL SURVEY TYPES:');
    for (const type of surveyTypes) {
      // Check if this survey type is being used
      const usageCount = await prisma.surveyDetails.count({
        where: { surveyTypeId: type.surveyTypeId }
      });
      
      console.log(`   ID: ${type.surveyTypeId} | Name: "${type.surveyTypeName.trim()}" | Used by: ${usageCount} surveys`);
    }
    
    // Find duplicates by name
    console.log('\n🔍 DUPLICATE ANALYSIS:');
    const typeNames = {};
    surveyTypes.forEach(type => {
      const cleanName = type.surveyTypeName.trim();
      if (!typeNames[cleanName]) {
        typeNames[cleanName] = [];
      }
      typeNames[cleanName].push(type);
    });
    
    const duplicates = [];
    Object.keys(typeNames).forEach(name => {
      if (typeNames[name].length > 1) {
        console.log(`   "${name}" appears ${typeNames[name].length} times:`);
        typeNames[name].forEach(type => {
          console.log(`     - ID: ${type.surveyTypeId} | Used by: surveys (checking...)`);
        });
        
        // Keep the first one, mark others for deletion
        duplicates.push(...typeNames[name].slice(1));
      }
    });
    
    console.log('\n🗑️  SAFE TO DELETE (unused duplicates):');
    if (duplicates.length === 0) {
      console.log('   No duplicates found that can be safely deleted.');
    } else {
      for (const duplicate of duplicates) {
        const usageCount = await prisma.surveyDetails.count({
          where: { surveyTypeId: duplicate.surveyTypeId }
        });
        
        if (usageCount === 0) {
          console.log(`   ✅ ID ${duplicate.surveyTypeId}: "${duplicate.surveyTypeName.trim()}" (${usageCount} surveys using it)`);
        } else {
          console.log(`   ❌ ID ${duplicate.surveyTypeId}: "${duplicate.surveyTypeName.trim()}" (${usageCount} surveys using it - CANNOT DELETE)`);
        }
      }
    }
    
    // Provide SQL commands for safe deletion
    console.log('\n📝 SQL COMMANDS FOR SUPABASE:');
    const safeDuplicates = [];
    for (const duplicate of duplicates) {
      const usageCount = await prisma.surveyDetails.count({
        where: { surveyTypeId: duplicate.surveyTypeId }
      });
      if (usageCount === 0) {
        safeDuplicates.push(duplicate);
      }
    }
    
    if (safeDuplicates.length > 0) {
      console.log('-- Run these in Supabase SQL Editor:');
      safeDuplicates.forEach(duplicate => {
        console.log(`DELETE FROM "SurveyTypeMaster" WHERE "surveyTypeId" = ${duplicate.surveyTypeId}; -- Removes duplicate "${duplicate.surveyTypeName.trim()}"`);
      });
    } else {
      console.log('-- No safe deletions available');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSurveyTypeUsage();