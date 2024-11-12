-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING';
