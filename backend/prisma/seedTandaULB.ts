import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface TandaULBData {
  ulb: {
    ulbName: string;
    ulbCode: string;
    description: string;
    isActive: boolean;
  };
  zone: {
    zoneNumber: string;
    zoneName: string;
    description: string;
    isActive: boolean;
  };
  wards: Array<{
    oldWardNumber: string;
    newWardNumber: string;
    wardName: string;
    wardCode: string;
    mohallaName: string;
  }>;
}

async function main() {
  console.log('🌍 Seeding Tanda ULB Geographic Data from JSON...\n');

  // Read the JSON file
  const jsonPath = path.join(__dirname, '..', 'Data', 'TandaULB.json');
  console.log(`📂 Reading data from: ${jsonPath}`);
  
  const jsonData: TandaULBData[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  
  if (!jsonData || jsonData.length === 0) {
    throw new Error('No data found in TandaULB.json');
  }

  const data = jsonData[0]; // We expect one ULB configuration

  console.log('\n✅ Data loaded successfully\n');
  console.log('='.repeat(60));

  // ============================================
  // 1. Create ULB (Urban Local Body) Master
  // ============================================
  console.log('\n📍 Creating ULB...');
  
  // Check if ULB already exists by code (if provided)
  let existingUlb = null;
  if (data.ulb.ulbCode && data.ulb.ulbCode.trim() !== '') {
    existingUlb = await prisma.ulbMaster.findFirst({
      where: { ulbCode: data.ulb.ulbCode },
    });
  }

  let ulb;
  if (existingUlb) {
    ulb = await prisma.ulbMaster.update({
      where: { ulbId: existingUlb.ulbId },
      data: {
        ulbName: data.ulb.ulbName,
        description: data.ulb.description,
        isActive: data.ulb.isActive,
      },
    });
    console.log(`✅ Updated ULB: ${ulb.ulbName} (${ulb.ulbCode || 'No Code'})`);
  } else {
    ulb = await prisma.ulbMaster.create({
      data: {
        ulbName: data.ulb.ulbName,
        ulbCode: data.ulb.ulbCode || null,
        description: data.ulb.description,
        isActive: data.ulb.isActive,
      },
    });
    console.log(`✅ Created ULB: ${ulb.ulbName} (ID: ${ulb.ulbId})`);
  }

  // ============================================
  // 2. Create Zone Master
  // ============================================
  console.log('\n🗺️  Creating Zone...');
  
  // Check if Zone already exists by number
  const existingZone = await prisma.zoneMaster.findFirst({
    where: { zoneNumber: data.zone.zoneNumber },
  });

  let zone;
  if (existingZone) {
    zone = await prisma.zoneMaster.update({
      where: { zoneId: existingZone.zoneId },
      data: {
        zoneName: data.zone.zoneName,
        description: data.zone.description,
        isActive: data.zone.isActive,
      },
    });
    console.log(`✅ Updated Zone: ${zone.zoneName} (${zone.zoneNumber})`);
  } else {
    zone = await prisma.zoneMaster.create({
      data: {
        zoneNumber: data.zone.zoneNumber,
        zoneName: data.zone.zoneName,
        description: data.zone.description,
        isActive: data.zone.isActive,
      },
    });
    console.log(`✅ Created Zone: ${zone.zoneName} (ID: ${zone.zoneId})`);
  }

  // ============================================
  // 3. Create ULB-Zone Mapping
  // ============================================
  console.log('\n🔗 Creating ULB-Zone Mapping...');
  
  // Check if mapping already exists
  const existingUlbZoneMapping = await prisma.ulbZoneMapping.findFirst({
    where: {
      ulbId: ulb.ulbId,
      zoneId: zone.zoneId,
    },
  });

  if (existingUlbZoneMapping) {
    await prisma.ulbZoneMapping.update({
      where: { ulbZoneMapId: existingUlbZoneMapping.ulbZoneMapId },
      data: { isActive: true },
    });
    console.log(`✅ Updated ULB-Zone Mapping`);
  } else {
    await prisma.ulbZoneMapping.create({
      data: {
        ulbId: ulb.ulbId,
        zoneId: zone.zoneId,
        isActive: true,
      },
    });
    console.log(`✅ Created ULB-Zone Mapping`);
  }

  // ============================================
  // 4. Create Wards and Mohallas
  // ============================================
  console.log('\n🏛️  Creating Wards and Mohallas...');
  
  let createdWardsCount = 0;
  let createdMohallasCount = 0;
  let createdMappingsCount = 0;

  for (const wardData of data.wards) {
    console.log(`\n   Processing Ward ${wardData.newWardNumber}: ${wardData.wardName}`);

    // Create/Update Ward using newWardNumber unique constraint
    const existingWard = await prisma.wardMaster.findFirst({
      where: { newWardNumber: wardData.newWardNumber },
    });

    let ward;
    if (existingWard) {
      ward = await prisma.wardMaster.update({
        where: { wardId: existingWard.wardId },
        data: {
          oldWardNumber: wardData.oldWardNumber,
          wardCode: wardData.wardCode,
          wardName: wardData.wardName,
          description: `Ward ${wardData.newWardNumber} - ${wardData.wardName}`,
          isActive: true,
        },
      });
      createdWardsCount++;
      console.log(`   ✅ Updated Ward: ${ward.wardName}`);
    } else {
      ward = await prisma.wardMaster.create({
        data: {
          newWardNumber: wardData.newWardNumber,
          oldWardNumber: wardData.oldWardNumber,
          wardCode: wardData.wardCode,
          wardName: wardData.wardName,
          description: `Ward ${wardData.newWardNumber} - ${wardData.wardName}`,
          isActive: true,
        },
      });
      createdWardsCount++;
      console.log(`   ✅ Created Ward: ${ward.wardName} (ID: ${ward.wardId})`);
    }

    // Create Zone-Ward Mapping
    const existingZoneWardMapping = await prisma.zoneWardMapping.findFirst({
      where: {
        zoneId: zone.zoneId,
        wardId: ward.wardId,
      },
    });

    if (existingZoneWardMapping) {
      await prisma.zoneWardMapping.update({
        where: { zoneWardMapId: existingZoneWardMapping.zoneWardMapId },
        data: { isActive: true },
      });
    } else {
      await prisma.zoneWardMapping.create({
        data: {
          zoneId: zone.zoneId,
          wardId: ward.wardId,
          isActive: true,
        },
      });
    }

    createdMappingsCount++;

    // Create/Update Mohalla
    const existingMohalla = await prisma.mohallaMaster.findFirst({
      where: { mohallaName: wardData.mohallaName },
    });

    let mohalla;
    if (existingMohalla) {
      mohalla = await prisma.mohallaMaster.update({
        where: { mohallaId: existingMohalla.mohallaId },
        data: {
          mohallaCode: `M-${wardData.wardCode}`,
          description: `Mohalla for Ward ${wardData.newWardNumber}`,
          isActive: true,
        },
      });
      createdMohallasCount++;
      console.log(`   ✅ Updated Mohalla: ${mohalla.mohallaName}`);
    } else {
      mohalla = await prisma.mohallaMaster.create({
        data: {
          mohallaName: wardData.mohallaName,
          mohallaCode: `M-${wardData.wardCode}`,
          description: `Mohalla for Ward ${wardData.newWardNumber}`,
          isActive: true,
        },
      });
      createdMohallasCount++;
      console.log(`   ✅ Created Mohalla: ${mohalla.mohallaName} (ID: ${mohalla.mohallaId})`);
    }

    // Create Ward-Mohalla Mapping
    const existingWardMohallaMapping = await prisma.wardMohallaMapping.findFirst({
      where: {
        wardId: ward.wardId,
        mohallaId: mohalla.mohallaId,
      },
    });

    if (existingWardMohallaMapping) {
      await prisma.wardMohallaMapping.update({
        where: { wardMohallaMapId: existingWardMohallaMapping.wardMohallaMapId },
        data: { isActive: true },
      });
    } else {
      await prisma.wardMohallaMapping.create({
        data: {
          wardId: ward.wardId,
          mohallaId: mohalla.mohallaId,
          isActive: true,
        },
      });
    }

    createdMappingsCount++;
  }
  
  console.log(`\n✅ Created/Updated ${createdWardsCount} Wards`);
  console.log(`✅ Created/Updated ${createdMohallasCount} Mohallas`);
  console.log(`✅ Created/Updated ${createdMappingsCount} Mappings`);

  // ============================================
  // Summary
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Tanda ULB Geographic Data Seeding Completed!');
  console.log('='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   • ULB: ${ulb.ulbName}`);
  console.log(`   • Zone: ${zone.zoneName}`);
  console.log(`   • Wards: ${createdWardsCount}`);
  console.log(`   • Mohallas: ${createdMohallasCount}`);
  console.log(`   • Total Mappings: ${createdMappingsCount + 1}`); // +1 for ULB-Zone mapping
  console.log('='.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ Error seeding Tanda ULB data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
