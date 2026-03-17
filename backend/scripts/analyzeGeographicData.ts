import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Analyzing Existing Geographic Data...\n');
  
  // Check ULBs
  const ulbs = await prisma.ulbMaster.findMany({
    include: {
      ulbZoneMaps: true,
    },
  });
  console.log(`📍 Found ${ulbs.length} ULBs:`);
  ulbs.forEach(ulb => {
    console.log(`   - ${ulb.ulbName} (${ulb.ulbCode}) - ${ulb.isActive ? 'Active' : 'Inactive'}`);
    console.log(`     Zones mapped: ${ulb.ulbZoneMaps.length}`);
  });
  
  // Check Zones
  const zones = await prisma.zoneMaster.findMany({
    include: {
      zoneWardMaps: true,
    },
  });
  console.log(`\n🗺️  Found ${zones.length} Zones:`);
  zones.forEach(zone => {
    console.log(`   - ${zone.zoneName} (${zone.zoneNumber}) - ${zone.isActive ? 'Active' : 'Inactive'}`);
    console.log(`     Wards mapped: ${zone.zoneWardMaps.length}`);
  });
  
  // Check Wards
  const wards = await prisma.wardMaster.findMany({
    include: {
      wardMohallaMaps: true,
      supervisors: true,
    },
  });
  console.log(`\n🏛️  Found ${wards.length} Wards:`);
  wards.forEach(ward => {
    console.log(`   - ${ward.wardName} (${ward.newWardNumber}) - ${ward.isActive ? 'Active' : 'Inactive'}`);
    console.log(`     Mohallas mapped: ${ward.wardMohallaMaps.length}`);
    console.log(`     Supervisors assigned: ${ward.supervisors.length}`);
  });
  
  // Check Mohallas
  const mohallas = await prisma.mohallaMaster.findMany({
    include: {
      wardMohallaMaps: true,
    },
  });
  console.log(`\n🏘️  Found ${mohallas.length} Mohallas:`);
  mohallas.forEach(mohalla => {
    console.log(`   - ${mohalla.mohallaName} (${mohalla.mohallaCode}) - ${mohalla.isActive ? 'Active' : 'Inactive'}`);
    console.log(`     Mapped to ${mohalla.wardMohallaMaps.length} ward(s)`);
  });
  
  // Analysis Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 ANALYSIS SUMMARY');
  console.log('='.repeat(70));
  
  const wardsWithoutMohallas = wards.filter(w => w.wardMohallaMaps.length === 0);
  const wardsWithMohallas = wards.filter(w => w.wardMohallaMaps.length > 0);
  
  console.log(`\n✅ Wards WITH Mohallas: ${wardsWithMohallas.length}`);
  wardsWithMohallas.forEach(ward => {
    console.log(`   • ${ward.wardName} - ${ward.wardMohallaMaps.length} mohalla(s)`);
  });
  
  console.log(`\n⚠️  Wards WITHOUT Mohallas: ${wardsWithoutMohallas.length}`);
  if (wardsWithoutMohallas.length > 0) {
    console.log('   These wards can be directly assigned to surveyors:');
    wardsWithoutMohallas.forEach(ward => {
      console.log(`   • ${ward.wardName} (${ward.newWardNumber})`);
    });
  }
  
  // Check for Test data
  const testWards = wards.filter(w => 
    w.wardName.toLowerCase().includes('test') || 
    w.newWardNumber.toLowerCase().includes('test')
  );
  console.log(`\n🧪 Test Wards Found: ${testWards.length}`);
  testWards.forEach(ward => {
    console.log(`   • ${ward.wardName} (${ward.newWardNumber})`);
    console.log(`     Mohallas: ${ward.wardMohallaMaps.length}`);
  });
  
  // Check mapping integrity
  console.log('\n🔗 Mapping Integrity Check:');
  const totalWardMohallaMappings = await prisma.wardMohallaMapping.count();
  const totalZoneWardMappings = await prisma.zoneWardMapping.count();
  const totalUlbZoneMappings = await prisma.ulbZoneMapping.count();
  
  console.log(`   • ULB-Zone Mappings: ${totalUlbZoneMappings}`);
  console.log(`   • Zone-Ward Mappings: ${totalZoneWardMappings}`);
  console.log(`   • Ward-Mohalla Mappings: ${totalWardMohallaMappings}`);
  
  // Check for orphaned records
  const orphanedWards = await prisma.wardMaster.findMany({
    where: {
      zoneWardMaps: {
        none: {}
      }
    }
  });
  
  if (orphanedWards.length > 0) {
    console.log(`\n⚠️  WARNING: ${orphanedWards.length} wards are not mapped to any zone!`);
    orphanedWards.forEach(w => {
      console.log(`   • ${w.wardName} (${w.newWardNumber})`);
    });
  } else {
    console.log('\n✅ All wards are properly mapped to zones');
  }
  
  console.log('\n' + '='.repeat(70));
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
