/*
  Warnings:

  - Added the required column `orgLogo` to the `Opportunities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Opportunities" ADD COLUMN     "orgLogo" TEXT NOT NULL;
