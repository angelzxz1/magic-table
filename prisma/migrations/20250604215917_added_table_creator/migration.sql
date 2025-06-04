/*
  Warnings:

  - Added the required column `creator` to the `GameTable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameTable" ADD COLUMN     "creator" TEXT NOT NULL;
