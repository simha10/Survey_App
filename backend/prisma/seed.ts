import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Master Tables with integer IDs
  console.log('Seeding master tables...');

  // ResponseTypeMaster
  const responseTypes = [
    { responseTypeName: 'OLD PROPERTY', description: 'Existing property' },
    { responseTypeName: 'NEW PROPERTY', description: 'New property' },
    { responseTypeName: 'DOOR LOCK', description: 'Door locked' },
    { responseTypeName: 'ACCESS DENIED', description: 'Access denied' },
  ];

  await prisma.responseTypeMaster.createMany({
    data: responseTypes.map(type => ({
      responseTypeName: type.responseTypeName,
      isActive: true,
      description: type.description,
    })),
    skipDuplicates: true,
  });

  // PropertyTypeMaster
  const propertyTypes = [
    { propertyTypeName: 'HOUSE', description: 'House property' },
    { propertyTypeName: 'FLAT', description: 'Flat property' },
    { propertyTypeName: 'PLOT/LAND', description: 'Plot or land' },
  ];

  await prisma.propertyTypeMaster.createMany({
    data: propertyTypes.map(type => ({
      propertyTypeName: type.propertyTypeName,
      isActive: true,
      description: type.description,
    })),
    skipDuplicates: true,
  });

  // RespondentStatusMaster
  const respondentStatuses = [
    { respondentStatusName: 'OWNER', description: 'Property owner' },
    { respondentStatusName: 'OCCUPIER', description: 'Property occupier' },
    { respondentStatusName: 'TENANT', description: 'Property tenant' },
    { respondentStatusName: 'EMPLOYEE', description: 'Property employee' },
    { respondentStatusName: 'OTHER', description: 'Other respondent' },
  ];

  await prisma.respondentStatusMaster.createMany({
    data: respondentStatuses.map(status => ({
      respondentStatusName: status.respondentStatusName,
      isActive: true,
      description: status.description,
    })),
    skipDuplicates: true,
  });

  // RoadTypeMaster
  const roadTypes = [
    { roadTypeName: 'WIDTH LESS THAN 3M', description: 'Road width less than 3 meters' },
    { roadTypeName: 'WIDTH 3 TO 11M', description: 'Road width 3 to 11 meters' },
    { roadTypeName: 'WIDTH 12 TO 24M', description: 'Road width 12 to 24 meters' },
    { roadTypeName: 'WIDTH MORE THAN 24M', description: 'Road width more than 24 meters' },
  ];

  await prisma.roadTypeMaster.createMany({
    data: roadTypes.map(type => ({
      roadTypeName: type.roadTypeName,
      isActive: true,
      description: type.description,
    })),
    skipDuplicates: true,
  });

  // ConstructionTypeMaster
  const constructionTypes = [
    { constructionTypeName: 'CONSTRUCTED', description: 'Fully constructed' },
    { constructionTypeName: 'NOT CONSTRUCTED', description: 'Not constructed' },
    { constructionTypeName: 'UNDER CONSTRUCTION', description: 'Under construction' },
  ];

  await prisma.constructionTypeMaster.createMany({
    data: constructionTypes.map(type => ({
      constructionTypeName: type.constructionTypeName,
      isActive: true,
      description: type.description,
    })),
    skipDuplicates: true,
  });

  // WaterSourceMaster
  const waterSources = [
    { waterSourceName: 'OWN', description: 'Own water source' },
    { waterSourceName: 'MUNICIPAL', description: 'Municipal water supply' },
    { waterSourceName: 'PUBLIC TAP WITHIN 100 YARDS', description: 'Public tap within 100 yards' },
    { waterSourceName: 'PUBLIC TAP MORE THAN 100 YARDS', description: 'Public tap more than 100 yards' },
  ];

  await prisma.waterSourceMaster.createMany({
    data: waterSources.map(source => ({
      waterSourceName: source.waterSourceName,
      isActive: true,
      description: source.description,
    })),
    skipDuplicates: true,
  });

  // DisposalTypeMaster
  const disposalTypes = [
    { disposalTypeName: 'SEWERAGE', description: 'Sewerage system' },
    { disposalTypeName: 'SEPTIC TANK', description: 'Septic tank' },
  ];

  await prisma.disposalTypeMaster.createMany({
    data: disposalTypes.map(type => ({
      disposalTypeName: type.disposalTypeName,
      isActive: true,
      description: type.description,
    })),
    skipDuplicates: true,
  });

  // FloorMaster
  const floors = [
    ...Array.from({ length: 9 }, (_, i) => ({
      floorNumberName: `Basement - ${9 - i}`,
      description: `Basement level ${9 - i}`,
    })),
    { floorNumberName: 'Ground Floor', description: 'Ground floor' },
    ...Array.from({ length: 50 }, (_, i) => ({
      floorNumberName: `Floor - ${i + 1}`,
      description: `Floor number ${i + 1}`,
    })),
  ];

  await prisma.floorMaster.createMany({
    data: floors.map(floor => ({
      floorNumberName: floor.floorNumberName,
      isActive: true,
      description: floor.description,
    })),
    skipDuplicates: true,
  });

  // NrPropertyCategoryMaster
  const nrPropertyCategories = [
    { propertyCategoryNumber: 1, propertyCategoryName: 'Every type of commercial complexes, shops and other establishments, banks, offices, hotels up to three star, private hotels, coaching and training institutes (except State Government aided)', description: 'Commercial complexes, shops, banks, offices, hotels up to 3 star, coaching institutes' },
    { propertyCategoryNumber: 2, propertyCategoryName: 'Every type of clinics, polyclinics, diagnostic centres, laboratories, nursing homes, dispensaries, hospitals, medical stores, health care centres, etc.', description: 'Medical facilities, clinics, hospitals, diagnostic centres' },
    { propertyCategoryNumber: 3, propertyCategoryName: 'Sports centres as gym, physical health centres, etc. and theatre and cinema houses', description: 'Sports centres, gyms, theatres, cinema houses' },
    { propertyCategoryNumber: 4, propertyCategoryName: 'Hostels, educational institutions', description: 'Hostels and educational institutions' },
    { propertyCategoryNumber: 5, propertyCategoryName: 'Petrol pumps, gas agencies, depots and godowns, etc.', description: 'Petrol pumps, gas agencies, depots, godowns' },
    { propertyCategoryNumber: 6, propertyCategoryName: 'Malls, hotels of four star and above, pubs, bars, lodging houses where wine is served with food', description: 'Malls, 4+ star hotels, pubs, bars, wine-serving lodging' },
    { propertyCategoryNumber: 7, propertyCategoryName: 'Community halls, Kalyan Mandaps, Marriage Houses, Clubs and same type of buildings', description: 'Community halls, marriage houses, clubs' },
    { propertyCategoryNumber: 8, propertyCategoryName: 'Industrial units, offices of Government, Semi-Government and public undertakings', description: 'Industrial units, government offices, public undertakings' },
    { propertyCategoryNumber: 9, propertyCategoryName: 'Building having towers and hoardings, T.V. Towers, telecom towers or any other tower which are installed either on the surface or on the top of the buildings or on the open space', description: 'Buildings with towers, hoardings, TV/telecom towers' },
    { propertyCategoryNumber: 10, propertyCategoryName: 'Other types of non-residential houses which are not mentioned in above categories', description: 'Other non-residential properties not covered above' },
  ];

  await prisma.nrPropertyCategoryMaster.createMany({
    data: nrPropertyCategories.map(category => ({
      propertyCategoryNumber: category.propertyCategoryNumber,
      propertyCategoryName: category.propertyCategoryName,
      isActive: true,
      description: category.description,
    })),
    skipDuplicates: true,
  });

  // NrPropertySubCategoryMaster
  const nrPropertySubCategories = [
    { subCategoryNumber: 1, subCategoryName: 'Bank', propertyCategoryNumber: 1 },
    { subCategoryNumber: 2, subCategoryName: 'Central Govt. Office with 33.33% SC', propertyCategoryNumber: 8 },
    { subCategoryNumber: 3, subCategoryName: 'Church', propertyCategoryNumber: 10 },
    { subCategoryNumber: 4, subCategoryName: 'Diploma-Degree College', propertyCategoryNumber: 4 },
    { subCategoryNumber: 5, subCategoryName: 'Diagnostic Center', propertyCategoryNumber: 2 },
    { subCategoryNumber: 6, subCategoryName: 'Guest House, Marriage Hall', propertyCategoryNumber: 7 },
    { subCategoryNumber: 7, subCategoryName: 'Gurudwara', propertyCategoryNumber: 10 },
    { subCategoryNumber: 8, subCategoryName: 'Hospital', propertyCategoryNumber: 2 },
    { subCategoryNumber: 9, subCategoryName: 'Hostel', propertyCategoryNumber: 4 },
    { subCategoryNumber: 10, subCategoryName: 'Hotel', propertyCategoryNumber: 1 },
    { subCategoryNumber: 11, subCategoryName: 'Industrial Unit', propertyCategoryNumber: 8 },
    { subCategoryNumber: 12, subCategoryName: 'Masjid', propertyCategoryNumber: 10 },
    { subCategoryNumber: 13, subCategoryName: 'Other Institute', propertyCategoryNumber: 1 },
    { subCategoryNumber: 14, subCategoryName: 'Petrol Pump', propertyCategoryNumber: 5 },
    { subCategoryNumber: 15, subCategoryName: 'College upto 12th Std.', propertyCategoryNumber: 4 },
    { subCategoryNumber: 16, subCategoryName: 'Shop', propertyCategoryNumber: 1 },
    { subCategoryNumber: 17, subCategoryName: 'State Govt. Office', propertyCategoryNumber: 8 },
    { subCategoryNumber: 18, subCategoryName: 'Temple', propertyCategoryNumber: 10 },
    { subCategoryNumber: 19, subCategoryName: 'Other', propertyCategoryNumber: 10 },
    { subCategoryNumber: 20, subCategoryName: 'Clinic', propertyCategoryNumber: 2 },
    { subCategoryNumber: 21, subCategoryName: 'Restaurant', propertyCategoryNumber: 1 },
    { subCategoryNumber: 22, subCategoryName: 'Wine Shop', propertyCategoryNumber: 6 },
    { subCategoryNumber: 23, subCategoryName: 'Private Office', propertyCategoryNumber: 1 },
    { subCategoryNumber: 24, subCategoryName: 'Park', propertyCategoryNumber: 10 },
    { subCategoryNumber: 25, subCategoryName: 'Public Toilet', propertyCategoryNumber: 10 },
    { subCategoryNumber: 26, subCategoryName: 'Godowns', propertyCategoryNumber: 5 },
    { subCategoryNumber: 27, subCategoryName: 'Kabristan', propertyCategoryNumber: 10 },
    { subCategoryNumber: 28, subCategoryName: 'Shamshaan Ghat', propertyCategoryNumber: 10 },
    { subCategoryNumber: 29, subCategoryName: 'Pani ki Tanki', propertyCategoryNumber: 10 },
    { subCategoryNumber: 30, subCategoryName: 'Fitness Center or Gym, etc.', propertyCategoryNumber: 3 },
    { subCategoryNumber: 31, subCategoryName: 'Cinema Hall', propertyCategoryNumber: 3 },
    { subCategoryNumber: 32, subCategoryName: 'Shopping Mall', propertyCategoryNumber: 1 },
    { subCategoryNumber: 33, subCategoryName: 'Hotel 4 Star and above', propertyCategoryNumber: 6 },
    { subCategoryNumber: 34, subCategoryName: 'Pub, Bar', propertyCategoryNumber: 6 },
    { subCategoryNumber: 35, subCategoryName: 'Any Tower or Hoarding', propertyCategoryNumber: 9 },
    { subCategoryNumber: 36, subCategoryName: 'SBM Toilet', propertyCategoryNumber: 10 },
    { subCategoryNumber: 37, subCategoryName: 'Police Station', propertyCategoryNumber: 8 },
    { subCategoryNumber: 38, subCategoryName: 'Court', propertyCategoryNumber: 8 },
    { subCategoryNumber: 39, subCategoryName: 'Nagar Nigam Property', propertyCategoryNumber: 10 },
    { subCategoryNumber: 40, subCategoryName: 'Central Govt. Office with 50% SC', propertyCategoryNumber: 8 },
    { subCategoryNumber: 41, subCategoryName: 'Central Govt. Office with 70% SC', propertyCategoryNumber: 8 },
    { subCategoryNumber: 42, subCategoryName: 'Stadium', propertyCategoryNumber: 10 },
    { subCategoryNumber: 43, subCategoryName: 'Archeology Department Undertaken Building', propertyCategoryNumber: 10 },
  ];

  // For subcategories, we need to get the actual category IDs first
  for (const subCategory of nrPropertySubCategories) {
    const category = await prisma.nrPropertyCategoryMaster.findFirst({
      where: { propertyCategoryNumber: subCategory.propertyCategoryNumber }
    });
    
    if (category) {
      await prisma.nrPropertySubCategoryMaster.createMany({
        data: [{
          subCategoryNumber: subCategory.subCategoryNumber,
          subCategoryName: subCategory.subCategoryName,
          propertyCategoryId: category.propertyCategoryId,
          isActive: true,
        }],
        skipDuplicates: true,
      });
    }
  }

  // ConstructionNatureMaster
  const constructionNatures = [
    { constructionNatureName: 'PUCCKAA RCC RB ROOF', description: 'Pucca with RCC roof' },
    { constructionNatureName: 'OTHER PUCCKAA', description: 'Other pucca construction' },
    { constructionNatureName: 'KUCCHHAA', description: 'Kuccha construction' },
  ];

  await prisma.constructionNatureMaster.createMany({
    data: constructionNatures.map(nature => ({
      constructionNatureName: nature.constructionNatureName,
      isActive: true,
      description: nature.description,
    })),
    skipDuplicates: true,
  });

  // SurveyTypeMaster
  const surveyTypes = [
    { surveyTypeName: 'RESIDENTIAL', description: 'Residential survey' },
    { surveyTypeName: 'NON RESIDENTIAL', description: 'Non-residential survey' },
    { surveyTypeName: 'MIX', description: 'Mixed survey' },
  ];

  await prisma.surveyTypeMaster.createMany({
    data: surveyTypes.map(type => ({
      surveyTypeName: type.surveyTypeName,
      isActive: true,
      description: type.description,
    })),
    skipDuplicates: true,
  });

  // OccupancyStatusMaster
  const occupancyStatuses = [
    { occupancyStatusName: 'SELF OCCUPIED', description: 'Self occupied' },
    { occupancyStatusName: 'RENTED', description: 'Rented property' },
    { occupancyStatusName: 'MIX', description: 'Mixed occupancy' },
  ];

  await prisma.occupancyStatusMaster.createMany({
    data: occupancyStatuses.map(status => ({
      occupancyStatusName: status.occupancyStatusName,
      isActive: true,
      description: status.description,
    })),
    skipDuplicates: true,
  });

  // SurveyStatusMaster
  const surveyStatuses = [
    { statusName: 'DRAFT', description: 'Survey in draft status' },
    { statusName: 'SUBMITTED', description: 'Survey submitted' },
    { statusName: 'UNDER REVIEW', description: 'Survey under review' },
    { statusName: 'APPROVED', description: 'Survey approved' },
    { statusName: 'REJECTED', description: 'Survey rejected' },
  ];

  await prisma.surveyStatusMaster.createMany({
    data: surveyStatuses.map(status => ({
      statusName: status.statusName,
      isActive: true,
      description: status.description,
    })),
    skipDuplicates: true,
  });

  // WardStatusMaster
  const wardStatuses = [
    { statusName: 'STARTED', description: 'Ward survey is started' },
    { statusName: 'NOT STARTED', description: 'Ward survey is not started' },
    { statusName: 'IN PROGRESS', description: 'Ward survey in progress' },
    { statusName: 'ON HOLD', description: 'Ward survey on hold' },
    { statusName: 'COMPLETED', description: 'Ward survey completed' },
  ];

  await prisma.wardStatusMaster.createMany({
    data: wardStatuses.map(status => ({
      statusName: status.statusName,
      isActive: true,
      description: status.description,
    })),
    skipDuplicates: true,
  });

  // 2. Ensure all roles exist (upsert)
  const roles = [
    { roleName: 'SUPERADMIN', description: 'System Super Admin' },
    { roleName: 'ADMIN', description: 'System Admin' },
    { roleName: 'SUPERVISOR', description: 'System Supervisor' },
    { roleName: 'SURVEYOR', description: 'System Surveyor' },
  ];

  await prisma.rolePermissionMaster.createMany({
    data: roles.map(role => ({
      roleName: role.roleName,
      isActive: true,
      description: role.description,
    })),
    skipDuplicates: true,
  });

  // 3. Get all role IDs
  const superAdminRole = await prisma.rolePermissionMaster.findFirst({
    where: { roleName: 'SUPERADMIN' }
  });
  const adminRole = await prisma.rolePermissionMaster.findFirst({
    where: { roleName: 'ADMIN' }
  });
  const supervisorRole = await prisma.rolePermissionMaster.findFirst({
    where: { roleName: 'SUPERVISOR' }
  });
  const surveyorRole = await prisma.rolePermissionMaster.findFirst({
    where: { roleName: 'SURVEYOR' }
  });

  // 4. Create test users with different roles
  const testUsers = [
    {
      username: 'superadmin',
      name: 'Super Administrator',
      password: 'superadmin123',
      mobileNumber: '1234567890',
      role: 'SUPERADMIN',
      roleId: superAdminRole?.roleId,
    },
    {
      username: 'admin',
      name: 'System Administrator',
      password: 'admin123',
      mobileNumber: '1234567891',
      role: 'ADMIN',
      roleId: adminRole?.roleId,
    },
    {
      username: 'supervisor',
      name: 'System Supervisor',
      password: 'supervisor123',
      mobileNumber: '1234567892',
      role: 'SUPERVISOR',
      roleId: supervisorRole?.roleId,
    },
    {
      username: 'surveyor',
      name: 'System Surveyor',
      password: 'surveyor123',
      mobileNumber: '1234567893',
      role: 'SURVEYOR',
      roleId: surveyorRole?.roleId,
    },
  ];

  for (const userData of testUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Check if user exists
    let user = await prisma.usersMaster.findFirst({ where: { username: userData.username } });
    
    if (!user) {
      // Create user
      user = await prisma.usersMaster.create({
        data: {
          username: userData.username,
          name: userData.name,
          password: hashedPassword,
          mobileNumber: userData.mobileNumber,
          isActive: true,
        },
      });

      // Create UserRoleMapping
      if (userData.roleId) {
        await prisma.userRoleMapping.create({
          data: {
            userId: user.userId,
            roleId: userData.roleId,
            isActive: true,
          }
        });
      }

      // Create role-specific table entry
      if (userData.role === 'SUPERADMIN' || userData.role === 'ADMIN') {
        await prisma.admins.create({
          data: {
            userId: user.userId,
            adminName: userData.name,
            username: userData.username,
            password: hashedPassword,
          }
        });
      } else if (userData.role === 'SUPERVISOR') {
        await prisma.supervisors.create({
          data: {
            userId: user.userId,
            supervisorName: userData.name,
            username: userData.username,
            password: hashedPassword,
          }
        });
      } else if (userData.role === 'SURVEYOR') {
        await prisma.surveyors.create({
          data: {
            userId: user.userId,
            surveyorName: userData.name,
            username: userData.username,
            password: hashedPassword,
          }
        });
      }

      console.log(`Created ${userData.role} user: ${userData.username}`);
    } else {
      console.log(`User ${userData.username} already exists, skipping...`);
    }
  }

  console.log('All master tables, roles and test users seeded successfully!');

  // NOTE: QC Workflow tables will be seeded after Prisma client generation
  // This is because the Prisma client needs to be regenerated after schema changes
  // Run this after: npx prisma generate
  console.log('⚠️  QC Workflow tables seeding requires Prisma client regeneration first');

  console.log('All master tables, roles and test users seeded successfully!');
  console.log('\nTest User Credentials:');
  console.log('SuperAdmin - Username: superadmin, Password: superadmin123');
  console.log('Admin - Username: admin, Password: admin123');
  console.log('Supervisor - Username: supervisor, Password: supervisor123');
  console.log('Surveyor - Username: surveyor, Password: surveyor123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
