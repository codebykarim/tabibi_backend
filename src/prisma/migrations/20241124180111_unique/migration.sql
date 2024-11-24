/*
  Warnings:

  - A unique constraint covering the columns `[data]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Session_data_key" ON "Session"("data");
