/*
  Warnings:

  - Made the column `data` on table `Identity` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Identity" ALTER COLUMN "data" SET NOT NULL;
