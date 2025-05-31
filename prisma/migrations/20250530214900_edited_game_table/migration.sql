/*
  Warnings:

  - You are about to drop the column `players` on the `GameTable` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GameTable" DROP COLUMN "players";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gameTableId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_gameTableId_fkey" FOREIGN KEY ("gameTableId") REFERENCES "GameTable"("id") ON DELETE SET NULL ON UPDATE CASCADE;
