/*
  Warnings:

  - You are about to drop the column `slash` on the `Colleges` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Colleges" DROP COLUMN "slash",
ADD COLUMN     "slack" TEXT NOT NULL DEFAULT E'';
