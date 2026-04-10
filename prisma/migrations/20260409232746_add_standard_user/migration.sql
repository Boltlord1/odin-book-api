/*
  Warnings:

  - You are about to drop the column `hash` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GithubUser" ADD CONSTRAINT "GithubUser_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "GithubUser_id_key";

-- AlterTable
ALTER TABLE "GoogleUser" ADD CONSTRAINT "GoogleUser_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "GoogleUser_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hash";

-- CreateTable
CREATE TABLE "standardUser" (
    "id" UUID NOT NULL,
    "hash" VARCHAR(255) NOT NULL,

    CONSTRAINT "standardUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "standardUser" ADD CONSTRAINT "standardUser_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
