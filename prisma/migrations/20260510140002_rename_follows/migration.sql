/*
  Warnings:

  - You are about to drop the `_follows` table. If the table is not empty, all the data it contains will be lost.

*/
-- -- DropForeignKey
-- ALTER TABLE "_follows" DROP CONSTRAINT "_follows_A_fkey";

-- -- DropForeignKey
-- ALTER TABLE "_follows" DROP CONSTRAINT "_follows_B_fkey";

-- -- DropTable
-- DROP TABLE "_follows";

-- -- CreateTable
-- CREATE TABLE "_follow" (
--     "A" TEXT NOT NULL,
--     "B" TEXT NOT NULL,

--     CONSTRAINT "_follow_AB_pkey" PRIMARY KEY ("A","B")
-- );

-- -- CreateIndex
-- CREATE INDEX "_follow_B_index" ON "_follow"("B");

-- -- AddForeignKey
-- ALTER TABLE "_follow" ADD CONSTRAINT "_follow_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "_follow" ADD CONSTRAINT "_follow_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Manual Edit

ALTER TABLE "_follows" RENAME TO "_follow";

ALTER INDEX "_follows_B_index" RENAME TO "_follow_B_index";

ALTER TABLE "_follow" DROP CONSTRAINT "_follows_A_fkey";
ALTER TABLE "_follow" DROP CONSTRAINT "_follows_B_fkey";

ALTER TABLE "_follow" ADD CONSTRAINT "_follow_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_follow" ADD CONSTRAINT "_follow_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
