/*
  Warnings:

  - Added the required column `uploadedById` to the `SurveyDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admins" ALTER COLUMN "password" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "Supervisors" ALTER COLUMN "password" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "SurveyDetails" ADD COLUMN     "uploadedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Surveyors" ALTER COLUMN "password" SET DATA TYPE VARCHAR(250);

-- CreateIndex
CREATE INDEX "SurveyDetails_uploadedById_idx" ON "SurveyDetails"("uploadedById");

-- AddForeignKey
ALTER TABLE "SurveyDetails" ADD CONSTRAINT "SurveyDetails_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
