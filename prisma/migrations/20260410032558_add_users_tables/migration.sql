/*
  Warnings:

  - The values [LOCAL,GOOGLE,GITHUB] on the enum `Provider` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `User` table. All the data in the column will be lost.

*/

-- AlterTable
ALTER TABLE "User" DROP COLUMN "provider",
DROP COLUMN "providerId";

-- CreateTable
CREATE TABLE "LocalUser" (
    "hash" VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "LocalUser_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "OauthUser" (
    "provider" "Provider" NOT NULL,
    "id" VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "OauthUser_pkey" PRIMARY KEY ("provider","id")
);

-- AlterEnum
BEGIN;
CREATE TYPE "Provider_new" AS ENUM ('github', 'google');
ALTER TABLE "OauthUser" ALTER COLUMN "provider" TYPE "Provider_new" USING ("provider"::text::"Provider_new");
ALTER TYPE "Provider" RENAME TO "Provider_old";
ALTER TYPE "Provider_new" RENAME TO "Provider";
DROP TYPE "public"."Provider_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "OauthUser_userId_key" ON "OauthUser"("userId");

-- AddForeignKey
ALTER TABLE "LocalUser" ADD CONSTRAINT "LocalUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OauthUser" ADD CONSTRAINT "OauthUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
