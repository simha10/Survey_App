/*
  Warnings:

  - You are about to drop the column `mohallaId` on the `SurveyorAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `wardMohallaMapId` on the `SurveyorAssignment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,wardId]` on the table `SurveyorAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SurveyorAssignment" DROP CONSTRAINT "SurveyorAssignment_mohallaId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyorAssignment" DROP CONSTRAINT "SurveyorAssignment_wardMohallaMapId_fkey";

-- DropIndex
DROP INDEX "SurveyorAssignment_userId_wardId_mohallaId_key";

-- AlterTable
ALTER TABLE "SurveyorAssignment" DROP COLUMN "mohallaId",
DROP COLUMN "wardMohallaMapId",
ADD COLUMN     "mohallaIds" VARCHAR(36)[];

-- CreateIndex
CREATE UNIQUE INDEX "SurveyorAssignment_userId_wardId_key" ON "SurveyorAssignment"("userId", "wardId");
