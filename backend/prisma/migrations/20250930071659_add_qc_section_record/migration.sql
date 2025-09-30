/*
  Warnings:

  - You are about to drop the `PropertyImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PropertyImage" DROP CONSTRAINT "PropertyImage_propertyId_fkey";

-- DropTable
DROP TABLE "PropertyImage";

-- CreateTable
CREATE TABLE "QCSectionRecord" (
    "qcSectionRecordId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "surveyUniqueCode" UUID NOT NULL,
    "qcLevel" INTEGER NOT NULL,
    "sectionKey" VARCHAR(64) NOT NULL,
    "qcStatus" "QCStatusEnum" NOT NULL,
    "remarks" TEXT,
    "reviewedById" TEXT NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QCSectionRecord_pkey" PRIMARY KEY ("qcSectionRecordId")
);

-- CreateIndex
CREATE INDEX "QCSectionRecord_surveyUniqueCode_idx" ON "QCSectionRecord"("surveyUniqueCode");

-- CreateIndex
CREATE INDEX "QCSectionRecord_qcLevel_idx" ON "QCSectionRecord"("qcLevel");

-- CreateIndex
CREATE INDEX "QCSectionRecord_sectionKey_idx" ON "QCSectionRecord"("sectionKey");

-- CreateIndex
CREATE UNIQUE INDEX "QCSectionRecord_surveyUniqueCode_qcLevel_sectionKey_key" ON "QCSectionRecord"("surveyUniqueCode", "qcLevel", "sectionKey");

-- AddForeignKey
ALTER TABLE "QCSectionRecord" ADD CONSTRAINT "QCSectionRecord_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "UsersMaster"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCSectionRecord" ADD CONSTRAINT "QCSectionRecord_surveyUniqueCode_fkey" FOREIGN KEY ("surveyUniqueCode") REFERENCES "SurveyDetails"("surveyUniqueCode") ON DELETE CASCADE ON UPDATE CASCADE;
