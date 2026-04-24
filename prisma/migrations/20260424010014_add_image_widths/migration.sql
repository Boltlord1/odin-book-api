/*
  Warnings:

  - Added the required column `width` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "width" INTEGER NOT NULL;
