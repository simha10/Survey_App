/*
  Warnings:

  - You are about to alter the column `propertyLatitude` on the `LocationDetails` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,6)` to `Decimal(9,8)`.
  - You are about to alter the column `propertyLongitude` on the `LocationDetails` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,6)` to `Decimal(9,8)`.

*/
-- AlterTable
ALTER TABLE "LocationDetails" ALTER COLUMN "propertyLatitude" SET DATA TYPE DECIMAL(9,8),
ALTER COLUMN "propertyLongitude" SET DATA TYPE DECIMAL(9,8);
