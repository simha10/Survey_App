/*
  Warnings:

  - A unique constraint covering the columns `[roleName]` on the table `RolePermissionMaster` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RolePermissionMaster_roleName_key" ON "RolePermissionMaster"("roleName");
