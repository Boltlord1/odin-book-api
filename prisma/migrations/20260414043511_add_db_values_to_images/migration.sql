/*
  Warnings:

  - The primary key for the `Image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `public_id` on the `Image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicId` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `Image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Image_public_id_key";

-- AlterTable
ALTER TABLE "Image" DROP CONSTRAINT "Image_pkey",
DROP COLUMN "public_id",
ADD COLUMN     "publicId" VARCHAR(255) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Image_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Image_publicId_key" ON "Image"("publicId");
