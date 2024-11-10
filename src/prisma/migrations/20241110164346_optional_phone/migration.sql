-- DropIndex
DROP INDEX "Admin_phone_key";

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "phone" DROP NOT NULL;
