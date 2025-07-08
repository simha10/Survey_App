/*
  Warnings:

  - The primary key for the `PropertyAttachmentDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "PropertyAttachmentDetails" DROP CONSTRAINT "PropertyAttachmentDetails_pkey",
ADD COLUMN     "surveyImagesId" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "surveyUniqueCode" DROP DEFAULT,
ADD CONSTRAINT "PropertyAttachmentDetails_pkey" PRIMARY KEY ("surveyImagesId");

-- CreateIndex
CREATE INDEX "PropertyAttachmentDetails_surveyImagesId_idx" ON "PropertyAttachmentDetails"("surveyImagesId");
