/*
  Warnings:

  - You are about to drop the column `replyCount` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `replyCount` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `replyCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Reply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_liked_replies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_commentId_fkey";

-- DropForeignKey
ALTER TABLE "_liked_replies" DROP CONSTRAINT "_liked_replies_A_fkey";

-- DropForeignKey
ALTER TABLE "_liked_replies" DROP CONSTRAINT "_liked_replies_B_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "replyCount",
ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "replyCount";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "replyCount";

-- DropTable
DROP TABLE "Reply";

-- DropTable
DROP TABLE "_liked_replies";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
