/*
  Warnings:

  - You are about to drop the column `hash` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `type` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('Private', 'Group');

-- DropIndex
DROP INDEX "Chat_hash_key";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "hash",
ADD COLUMN     "type" "ChatType" NOT NULL;
