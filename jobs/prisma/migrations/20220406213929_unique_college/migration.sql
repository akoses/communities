/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Colleges` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Colleges_name_key" ON "Colleges"("name");
