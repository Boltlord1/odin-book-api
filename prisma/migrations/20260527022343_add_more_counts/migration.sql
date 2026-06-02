/*
  Warnings:

  - Added the required column `messageCount` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `replyCount` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commentCount` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followerCount` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followingCount` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "messageCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "replyCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "commentCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "followerCount" INTEGER NOT NULL,
ADD COLUMN     "followingCount" INTEGER NOT NULL;
