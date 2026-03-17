import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Seeding Geographic Data...');

  // ============================================
  // 1. Create ULB (Urban Local Body) Masters
  // ============================================
  console.log('\n📍 Creating ULBs...');
  
  const ulbs = await prisma.ulbMaster.createMany({
    data: [
      {
        ulbId: 'ulb-001',
        ulbCode: 'ULB001',
        ulbName: 'Jaipur Municipal Corporation',
        description: 'Main municipal corporation for Jaipur city',
        isActive: true,
      },
      {
        ulbId: 'ulb-002',
        ulbCode: 'ULB002',
        ulbName: 'Jodhpur Nagar Nigam',
        description: 'Municipal corporation for Jodhpur city',
        isActive: true,
      },
      {
        ulbId: 'ulb-003',
        ulbCode: 'ULB003',
        ulbName: 'Udaipur Municipal Board',
        description: 'Municipal board for Udaipur region',
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });
  
  console.log(`✅ Created ${ulbs.count} ULBs`);

  // ============================================
  // 2. Create Zone Masters
  // ============================================
  console.log('\n🗺️  Creating Zones...');
  
  const zones = await prisma.zoneMaster.createMany({
    data: [
      // Jaipur Zones
      {
        zoneId: 'zone-001',
        zoneNumber: 'ZN-001',
        zoneName: 'Jaipur North Zone',
        description: 'Northern zone of Jaipur',
        isActive: true,
      },
      {
        zoneId: 'zone-002',
        zoneNumber: 'ZN-002',
        zoneName: 'Jaipur South Zone',
        description: 'Southern zone of Jaipur',
        isActive: true,
      },
      // Jodhpur Zones
      {
        zoneId: 'zone-003',
        zoneNumber: 'ZN-003',
        zoneName: 'Jodhpur Central Zone',
        description: 'Central zone of Jodhpur',
        isActive: true,
      },
      {
        zoneId: 'zone-004',
        zoneNumber: 'ZN-004',
        zoneName: 'Jodhpur East Zone',
        description: 'Eastern zone of Jodhpur',
        isActive: true,
      },
      // Udaipur Zones
      {
        zoneId: 'zone-005',
        zoneNumber: 'ZN-005',
        zoneName: 'Udaipur Lake Zone',
        description: 'Zone around lake areas in Udaipur',
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });
  
  console.log(`✅ Created ${zones.count} Zones`);

  // ============================================
  // 3. Create Ward Masters
  // ============================================
  console.log('\n🏛️  Creating Wards...');
  
  const wards = await prisma.wardMaster.createMany({
    data: [
      // Jaipur North Zone Wards
      {
        wardId: 'ward-001',
        newWardNumber: 'W-001',
        oldWardNumber: 'OW-001',
        wardCode: 'W001',
        wardName: 'Malviya Nagar Ward',
        description: 'Residential area in North Jaipur',
        isActive: false, // Will be activated via mapping
      },
      {
        wardId: 'ward-002',
        newWardNumber: 'W-002',
        oldWardNumber: 'OW-002',
        wardCode: 'W002',
        wardName: 'Vaishali Nagar Ward',
        description: 'Commercial and residential area',
        isActive: false,
      },
      {
        wardId: 'ward-003',
        newWardNumber: 'W-003',
        oldWardNumber: 'OW-003',
        wardCode: 'W003',
        wardName: 'Shyam Nagar Ward',
        description: 'Industrial and residential mix',
        isActive: false,
      },
      // Jaipur South Zone Wards
      {
        wardId: 'ward-004',
        newWardNumber: 'W-004',
        oldWardNumber: 'OW-004',
        wardCode: 'W004',
        wardName: 'Jagatpura Ward',
        description: 'Developing residential area',
        isActive: false,
      },
      {
        wardId: 'ward-005',
        newWardNumber: 'W-005',
        oldWardNumber: 'OW-005',
        wardCode: 'W005',
        wardName: 'Sanganer Ward',
        description: 'Historic town with textile industry',
        isActive: false,
      },
      // Jodhpur Central Zone Wards
      {
        wardId: 'ward-006',
        newWardNumber: 'W-006',
        oldWardNumber: 'OW-006',
        wardCode: 'W006',
        wardName: 'Sadar Bazaar Ward',
        description: 'Main market area',
        isActive: false,
      },
      {
        wardId: 'ward-007',
        newWardNumber: 'W-007',
        oldWardNumber: 'OW-007',
        wardCode: 'W007',
        wardName: 'Clock Tower Ward',
        description: 'Heritage area',
        isActive: false,
      },
      // Jodhpur East Zone Wards
      {
        wardId: 'ward-008',
        newWardNumber: 'W-008',
        oldWardNumber: 'OW-008',
        wardCode: 'W008',
        wardName: 'Shastri Nagar Ward',
        description: 'Residential colony',
        isActive: false,
      },
      // Udaipur Lake Zone Wards
      {
        wardId: 'ward-009',
        newWardNumber: 'W-009',
        oldWardNumber: 'OW-009',
        wardCode: 'W009',
        wardName: 'City Palace Ward',
        description: 'Tourist and heritage area',
        isActive: false,
      },
      {
        wardId: 'ward-010',
        newWardNumber: 'W-010',
        oldWardNumber: 'OW-010',
        wardCode: 'W010',
        wardName: 'Fateh Sagar Ward',
        description: 'Lakefront residential area',
        isActive: false,
      },
    ],
    skipDuplicates: true,
  });
  
  console.log(`✅ Created ${wards.count} Wards`);

  // ============================================
  // 4. Create Mohalla Masters
  // ============================================
  console.log('\n🏘️  Creating Mohallas...');
  
  const mohallas = await prisma.mohallaMaster.createMany({
    data: [
      // Malviya Nagar Ward Mohallas
      {
        mohallaId: 'mohalla-001',
        mohallaCode: 'M-001',
        mohallaName: 'Malviya Nagar Block A',
        description: 'First block of Malviya Nagar',
        isActive: true,
      },
      {
        mohallaId: 'mohalla-002',
        mohallaCode: 'M-002',
        mohallaName: 'Malviya Nagar Block B',
        description: 'Second block of Malviya Nagar',
        isActive: true,
      },
      // Vaishali Nagar Ward Mohallas
      {
        mohallaId: 'mohalla-003',
        mohallaCode: 'M-003',
        mohallaName: 'Vaishali Nagar Main Market',
        description: 'Market area of Vaishali Nagar',
        isActive: true,
      },
      {
        mohallaId: 'mohalla-004',
        mohallaCode: 'M-004',
        mohallaName: 'Vaishali Nagar Residential',
        description: 'Residential sector',
        isActive: true,
      },
      // Shyam Nagar Ward Mohallas
      {
        mohallaId: 'mohalla-005',
        mohallaCode: 'M-005',
        mohallaName: 'Shyam Nagar Industrial Area',
        description: 'Industrial zone',
        isActive: true,
      },
      // Jagatpura Ward Mohallas
      {
        mohallaId: 'mohalla-006',
        mohallaCode: 'M-006',
        mohallaName: 'Jagatpura Colony',
        description: 'Main residential colony',
        isActive: true,
      },
      {
        mohallaId: 'mohalla-007',
        mohallaCode: 'M-007',
        mohallaName: 'Jagatpura Extension',
        description: 'New extension area',
        isActive: true,
      },
      // Sanganer Ward Mohallas
      {
        mohallaId: 'mohalla-008',
        mohallaCode: 'M-008',
        mohallaName: 'Sanganer Textile Market',
        description: 'Textile business area',
        isActive: true,
      },
      // Sadar Bazaar Ward Mohallas
      {
        mohallaId: 'mohalla-009',
        mohallaCode: 'M-009',
        mohallaName: 'Sadar Bazaar Main',
        description: 'Main market street',
        isActive: true,
      },
      {
        mohallaId: 'mohalla-010',
        mohallaCode: 'M-010',
        mohallaName: 'Sadar Bazaar East',
        description: 'Eastern market extension',
        isActive: true,
      },
      // Clock Tower Ward Mohallas
      {
        mohallaId: 'mohalla-011',
        mohallaCode: 'M-011',
        mohallaName: 'Heritage Quarter',
        description: 'Historic buildings area',
        isActive: true,
      },
      // Shastri Nagar Ward Mohallas
      {
        mohallaId: 'mohalla-012',
        mohallaCode: 'M-012',
        mohallaName: 'Shastri Nagar Sector 1',
        description: 'First residential sector',
        isActive: true,
      },
      // City Palace Ward Mohallas
      {
        mohallaId: 'mohalla-013',
        mohallaCode: 'M-013',
        mohallaName: 'Palace Road',
        description: 'Road leading to palace',
        isActive: true,
      },
      // Fateh Sagar Ward Mohallas
      {
        mohallaId: 'mohalla-014',
        mohallaCode: 'M-014',
        mohallaName: 'Lake View Colony',
        description: 'Colony with lake view',
        isActive: true,
      },
      {
        mohallaId: 'mohalla-015',
        mohallaCode: 'M-015',
        mohallaName: 'Fateh Sagar East',
        description: 'Eastern lakeside area',
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });
  
  console.log(`✅ Created ${mohallas.count} Mohallas`);

  // ============================================
  // 5. Create ULB-Zone Mappings
  // ============================================
  console.log('\n🔗 Creating ULB-Zone Mappings...');
  
  const ulbZoneMappings = await prisma.ulbZoneMapping.createMany({
    data: [
      // Jaipur Municipal Corporation
      { ulbId: 'ulb-001', zoneId: 'zone-001', isActive: true },
      { ulbId: 'ulb-001', zoneId: 'zone-002', isActive: true },
      // Jodhpur Nagar Nigam
      { ulbId: 'ulb-002', zoneId: 'zone-003', isActive: true },
      { ulbId: 'ulb-002', zoneId: 'zone-004', isActive: true },
      // Udaipur Municipal Board
      { ulbId: 'ulb-003', zoneId: 'zone-005', isActive: true },
    ],
    skipDuplicates: true,
  });
  
  console.log(`✅ Created ${ulbZoneMappings.count} ULB-Zone mappings`);

  // ============================================
  // 6. Create Zone-Ward Mappings
  // ============================================
  console.log('\n🔗 Creating Zone-Ward Mappings...');
  
  const zoneWardMappings = await prisma.zoneWardMapping.createMany({
    data: [
      // Jaipur North Zone
      { zoneId: 'zone-001', wardId: 'ward-001', isActive: true },
      { zoneId: 'zone-001', wardId: 'ward-002', isActive: true },
      { zoneId: 'zone-001', wardId: 'ward-003', isActive: true },
      // Jaipur South Zone
      { zoneId: 'zone-002', wardId: 'ward-004', isActive: true },
      { zoneId: 'zone-002', wardId: 'ward-005', isActive: true },
      // Jodhpur Central Zone
      { zoneId: 'zone-003', wardId: 'ward-006', isActive: true },
      { zoneId: 'zone-003', wardId: 'ward-007', isActive: true },
      // Jodhpur East Zone
      { zoneId: 'zone-004', wardId: 'ward-008', isActive: true },
      // Udaipur Lake Zone
      { zoneId: 'zone-005', wardId: 'ward-009', isActive: true },
      { zoneId: 'zone-005', wardId: 'ward-010', isActive: true },
    ],
    skipDuplicates: true,
  });
  
  console.log(`✅ Created ${zoneWardMappings.count} Zone-Ward mappings`);

  // ============================================
  // 7. Create Ward-Mohalla Mappings
  // ============================================
  console.log('\n🔗 Creating Ward-Mohalla Mappings...');
  
  const wardMohallaMappings = await prisma.wardMohallaMapping.createMany({
    data: [
      // Malviya Nagar Ward
      { wardId: 'ward-001', mohallaId: 'mohalla-001', isActive: true },
      { wardId: 'ward-001', mohallaId: 'mohalla-002', isActive: true },
      // Vaishali Nagar Ward
      { wardId: 'ward-002', mohallaId: 'mohalla-003', isActive: true },
      { wardId: 'ward-002', mohallaId: 'mohalla-004', isActive: true },
      // Shyam Nagar Ward
      { wardId: 'ward-003', mohallaId: 'mohalla-005', isActive: true },
      // Jagatpura Ward
      { wardId: 'ward-004', mohallaId: 'mohalla-006', isActive: true },
      { wardId: 'ward-004', mohallaId: 'mohalla-007', isActive: true },
      // Sanganer Ward
      { wardId: 'ward-005', mohallaId: 'mohalla-008', isActive: true },
      // Sadar Bazaar Ward
      { wardId: 'ward-006', mohallaId: 'mohalla-009', isActive: true },
      { wardId: 'ward-006', mohallaId: 'mohalla-010', isActive: true },
      // Clock Tower Ward
      { wardId: 'ward-007', mohallaId: 'mohalla-011', isActive: true },
      // Shastri Nagar Ward
      { wardId: 'ward-008', mohallaId: 'mohalla-012', isActive: true },
      // City Palace Ward
      { wardId: 'ward-009', mohallaId: 'mohalla-013', isActive: true },
      // Fateh Sagar Ward
      { wardId: 'ward-010', mohallaId: 'mohalla-014', isActive: true },
      { wardId: 'ward-010', mohallaId: 'mohalla-015', isActive: true },
    ],
    skipDuplicates: true,
  });
  
  console.log(`✅ Created ${wardMohallaMappings.count} Ward-Mohalla mappings`);

  // ============================================
  // Summary
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Geographic Data Seeding Completed Successfully!');
  console.log('='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   • ULBs: ${await prisma.ulbMaster.count()}`);
  console.log(`   • Zones: ${await prisma.zoneMaster.count()}`);
  console.log(`   • Wards: ${await prisma.wardMaster.count()}`);
  console.log(`   • Mohallas: ${await prisma.mohallaMaster.count()}`);
  console.log(`   • ULB-Zone Mappings: ${await prisma.ulbZoneMapping.count()}`);
  console.log(`   • Zone-Ward Mappings: ${await prisma.zoneWardMapping.count()}`);
  console.log(`   • Ward-Mohalla Mappings: ${await prisma.wardMohallaMapping.count()}`);
  console.log('='.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ Error seeding geographic data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
