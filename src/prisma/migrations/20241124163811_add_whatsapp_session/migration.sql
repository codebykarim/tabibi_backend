/*
  Warnings:

  - You are about to drop the column `bloodPressure` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `intensity` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `medication` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `oxgyenLevel` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `requestedPapers` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `theMedicationReason` on the `Form` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "bloodPressure",
DROP COLUMN "duration",
DROP COLUMN "intensity",
DROP COLUMN "medication",
DROP COLUMN "oxgyenLevel",
DROP COLUMN "requestedPapers",
DROP COLUMN "theMedicationReason",
ADD COLUMN     "currentBloodPressure" TEXT,
ADD COLUMN     "currentOxygen" TEXT,
ADD COLUMN     "intensityOfSymptoms" TEXT,
ADD COLUMN     "medicine" TEXT,
ADD COLUMN     "medicineReason" TEXT,
ADD COLUMN     "requiredPapers" TEXT,
ADD COLUMN     "startOfSymptoms" TEXT;

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
