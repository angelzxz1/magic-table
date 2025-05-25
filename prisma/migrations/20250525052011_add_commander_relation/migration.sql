/*
  Warnings:

  - You are about to drop the column `commander` on the `Deck` table. All the data in the column will be lost.
  - Added the required column `commanderId` to the `Deck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deck" DROP COLUMN "commander",
ADD COLUMN     "commanderId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_commanderId_fkey" FOREIGN KEY ("commanderId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
