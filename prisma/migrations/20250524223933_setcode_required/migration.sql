/*
  Warnings:

  - Made the column `setCode` on table `Card` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "setCode" SET NOT NULL;
