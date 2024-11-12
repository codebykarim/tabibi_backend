/*
  Warnings:

  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('REMINDER', 'MESSAGE', 'URGENT');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "type" "NotificationType" NOT NULL;
