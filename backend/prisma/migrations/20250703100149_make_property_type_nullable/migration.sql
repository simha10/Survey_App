-- DropForeignKey
ALTER TABLE "LocationDetails" DROP CONSTRAINT "LocationDetails_propertyTypeId_fkey";

-- AlterTable
ALTER TABLE "LocationDetails" ALTER COLUMN "propertyTypeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "PropertyTypeMaster"("propertyTypeId") ON DELETE SET NULL ON UPDATE CASCADE;
