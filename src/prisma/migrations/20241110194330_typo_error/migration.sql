/*
  Warnings:

  - You are about to drop the `village` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "village";

-- CreateTable
CREATE TABLE "Village" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Village_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Village_id_key" ON "Village"("id");
