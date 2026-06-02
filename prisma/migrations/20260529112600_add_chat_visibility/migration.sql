/*
  Warnings:

  - You are about to drop the column `deleted` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "deleted";

-- CreateTable
CREATE TABLE "_visible_chats" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_visible_chats_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_visible_chats_B_index" ON "_visible_chats"("B");

-- AddForeignKey
ALTER TABLE "_visible_chats" ADD CONSTRAINT "_visible_chats_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_visible_chats" ADD CONSTRAINT "_visible_chats_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
