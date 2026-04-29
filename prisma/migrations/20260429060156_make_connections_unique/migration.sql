/*
  Warnings:

  - A unique constraint covering the columns `[userId,provider]` on the table `Identity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Identity_userId_provider_key" ON "Identity"("userId", "provider");
