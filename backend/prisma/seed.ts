import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Ensure all roles exist (upsert)
  const roles = [
    { roleName: 'SUPERADMIN', description: 'System Super Admin' },
    { roleName: 'ADMIN', description: 'System Admin' },
    { roleName: 'SUPERVISOR', description: 'System Supervisor' },
    { roleName: 'SURVEYOR', description: 'System Surveyor' },
  ];

  for (const role of roles) {
    await prisma.rolePermissionMaster.upsert({
      where: { roleName: role.roleName },
      update: {},
      create: {
        roleName: role.roleName,
        isActive: true,
        description: role.description,
      },
    });
  }

  // 2. Get all role IDs
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

  // 3. Create test users with different roles
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

  console.log('All roles and test users seeded successfully!');
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


  