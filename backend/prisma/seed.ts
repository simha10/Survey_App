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

  // 2. Get the SUPERADMIN roleId
  const superAdminRole = await prisma.rolePermissionMaster.findFirst({
    where: { roleName: 'SUPERADMIN' }
  });

  // 3. Create SuperAdmin user if not exists
  const username = 'superadmin';
  const password = 'superadmin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  let superAdmin = await prisma.usersMaster.findFirst({ where: { username } });
  if (!superAdmin) {
    superAdmin = await prisma.usersMaster.create({
      data: {
        username,
        password: hashedPassword,
        mobileNumber: '1234567890',
        isActive: true,
      },
    });
  }

  // 4. Create UserRoleMapping if not exists
  const userRoleMap = await prisma.userRoleMapping.findFirst({
    where: { userId: superAdmin.userId, roleId: superAdminRole?.roleId }
  });
  if (!userRoleMap && superAdminRole) {
    await prisma.userRoleMapping.create({
      data: {
        userId: superAdmin.userId,
        roleId: superAdminRole.roleId,
        isActive: true,
      }
    });
  }

  // 5. Create entry in Admins table (for SUPERADMIN/ADMIN)
  let admin = await prisma.admins.findFirst({ where: { userId: superAdmin.userId } });
  if (!admin) {
    await prisma.admins.create({
      data: {
        userId: superAdmin.userId,
        adminName: username,
        username,
        password: hashedPassword,
      }
    });
  }

  console.log('Roles and SuperAdmin seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });