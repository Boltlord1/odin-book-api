/*
  Warnings:

  - You are about to drop the column `deleted` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Reply` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "deleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "deleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "deleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "deleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
