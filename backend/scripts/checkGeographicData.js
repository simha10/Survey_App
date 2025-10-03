const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkGeographicData() {
  try {
    console.log('🌍 Checking geographic data availability...\n');
    
    // Check ULBs
    console.log('🏛️ ULBs:');
    const ulbs = await prisma.ulbMaster.findMany();
    const activeUlbs = await prisma.ulbMaster.findMany({ where: { isActive: true } });
    console.log(`   Total: ${ulbs.length} | Active: ${activeUlbs.length}`);
    if (ulbs.length > 0) {
      console.log(`   Sample: ${ulbs[0].ulbId} | "${ulbs[0].ulbName}" | Active: ${ulbs[0].isActive}`);
    }
    
    // Check Zones
    console.log('\n🗺️ Zones:');
    const zones = await prisma.zoneMaster.findMany();
    const activeZones = await prisma.zoneMaster.findMany({ where: { isActive: true } });
    console.log(`   Total: ${zones.length} | Active: ${activeZones.length}`);
    if (zones.length > 0) {
      console.log(`   Sample: ${zones[0].zoneId} | "${zones[0].zoneName || zones[0].zoneNumber}" | Active: ${zones[0].isActive}`);
    }
    
    // Check Wards
    console.log('\n🏘️ Wards:');
    const wards = await prisma.wardMaster.findMany();
    const activeWards = await prisma.wardMaster.findMany({ where: { isActive: true } });
    console.log(`   Total: ${wards.length} | Active: ${activeWards.length}`);
    if (wards.length > 0) {
      console.log(`   Sample: ${wards[0].wardId} | "${wards[0].wardName}" | Active: ${wards[0].isActive}`);
    }
    
    // Check Mohallas
    console.log('\n🏠 Mohallas:');
    const mohallas = await prisma.mohallaMaster.findMany();
    const activeMohallas = await prisma.mohallaMaster.findMany({ where: { isActive: true } });
    console.log(`   Total: ${mohallas.length} | Active: ${activeMohallas.length}`);
    if (mohallas.length > 0) {
      console.log(`   Sample: ${mohallas[0].mohallaId} | "${mohallas[0].mohallaName}" | Active: ${mohallas[0].isActive}`);
    }
    
    // Check Users
    console.log('\n👥 Users by Role:');
    const allUsers = await prisma.usersMaster.findMany({
      include: {
        userRoleMaps: {
          include: { role: true },
          where: { isActive: true }
        }
      }
    });
    
    const roleGroups = {};
    allUsers.forEach(user => {
      user.userRoleMaps.forEach(urm => {
        const roleName = urm.role.roleName;
        if (!roleGroups[roleName]) roleGroups[roleName] = [];
        roleGroups[roleName].push(user);
      });
    });
    
    Object.keys(roleGroups).forEach(role => {
      console.log(`   ${role}: ${roleGroups[role].length} users`);
    });
    
    // Recommendation
    console.log('\n💡 RECOMMENDATIONS:');
    if (activeWards.length === 0 && wards.length > 0) {
      console.log('   ⚠️  No active wards found, but wards exist. Consider:');
      console.log('   1. Update wards to set isActive = true');
      console.log('   2. Modify dummy data script to not filter by isActive');
    }
    
    if (activeMohallas.length === 0 && mohallas.length > 0) {
      console.log('   ⚠️  No active mohallas found, but mohallas exist. Same recommendations as wards.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkGeographicData();