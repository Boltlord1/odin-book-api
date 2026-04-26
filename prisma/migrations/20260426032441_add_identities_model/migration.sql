/*
  Warnings:

  - You are about to drop the `LocalUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OauthUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "Provider" ADD VALUE 'email';

-- DropForeignKey
ALTER TABLE "LocalUser" DROP CONSTRAINT "LocalUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "OauthUser" DROP CONSTRAINT "OauthUser_userId_fkey";

-- DropTable
DROP TABLE "LocalUser";

-- DropTable
DROP TABLE "OauthUser";

-- CreateTable
CREATE TABLE "Identity" (
    "provider" "Provider" NOT NULL,
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "data" TEXT,

    CONSTRAINT "Identity_pkey" PRIMARY KEY ("provider","id")
);

-- AddForeignKey
ALTER TABLE "Identity" ADD CONSTRAINT "Identity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
