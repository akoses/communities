-- AlterTable
ALTER TABLE "Resources" ADD COLUMN     "hostname" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "image" TEXT NOT NULL DEFAULT E'';
