/*
  Warnings:

  - You are about to drop the column `format` on the `Deck` table. All the data in the column will be lost.
  - Added the required column `commander` to the `Deck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deck" DROP COLUMN "format",
ADD COLUMN     "commander" TEXT NOT NULL;
