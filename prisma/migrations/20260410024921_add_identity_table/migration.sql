/*
  Warnings:

  - You are about to drop the `GithubUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GoogleUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `standardUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('LOCAL', 'GOOGLE', 'GITHUB');

-- DropForeignKey
ALTER TABLE "GithubUser" DROP CONSTRAINT "GithubUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "GoogleUser" DROP CONSTRAINT "GoogleUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "standardUser" DROP CONSTRAINT "standardUser_id_fkey";

-- DropTable
DROP TABLE "GithubUser";

-- DropTable
DROP TABLE "GoogleUser";

-- DropTable
DROP TABLE "standardUser";

-- CreateTable
CREATE TABLE "Identity" (
    "id" UUID NOT NULL,
    "hash" VARCHAR(255),
    "provider" "Provider" NOT NULL,
    "providerId" VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Identity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Identity_provider_userId_key" ON "Identity"("provider", "userId");

-- AddForeignKey
ALTER TABLE "Identity" ADD CONSTRAINT "Identity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
