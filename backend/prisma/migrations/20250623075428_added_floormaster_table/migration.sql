/*
  Warnings:

  - You are about to drop the column `floorNumber` on the `NonResidentialPropertyAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `floorNumber` on the `ResidentialPropertyAssessment` table. All the data in the column will be lost.
  - Added the required column `floornumberId` to the `NonResidentialPropertyAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floornumberId` to the `ResidentialPropertyAssessment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NonResidentialPropertyAssessment" DROP COLUMN "floorNumber",
ADD COLUMN     "floornumberId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ResidentialPropertyAssessment" DROP COLUMN "floorNumber",
ADD COLUMN     "floornumberId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "FloorMaster" (
    "floornumberId" SERIAL NOT NULL,
    "floorNumberName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,

    CONSTRAINT "FloorMaster_pkey" PRIMARY KEY ("floornumberId")
);

-- AddForeignKey
ALTER TABLE "ResidentialPropertyAssessment" ADD CONSTRAINT "ResidentialPropertyAssessment_floornumberId_fkey" FOREIGN KEY ("floornumberId") REFERENCES "FloorMaster"("floornumberId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonResidentialPropertyAssessment" ADD CONSTRAINT "NonResidentialPropertyAssessment_floornumberId_fkey" FOREIGN KEY ("floornumberId") REFERENCES "FloorMaster"("floornumberId") ON DELETE RESTRICT ON UPDATE CASCADE;
