/*
  Warnings:

  - Added the required column `builtupArea` to the `NonResidentialPropertyAssessment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NonResidentialPropertyAssessment" ADD COLUMN     "builtupArea" DOUBLE PRECISION NOT NULL;
