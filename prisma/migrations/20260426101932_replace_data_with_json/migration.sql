/*
  Warnings:

  - The values [github,google,email] on the enum `Provider` will be removed. If these variants are still used in the database, this will fail.
  - The `data` column on the `Identity` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Provider_new" AS ENUM ('Email', 'Github', 'Google');
ALTER TABLE "Identity" ALTER COLUMN "provider" TYPE "Provider_new" USING ("provider"::text::"Provider_new");
ALTER TYPE "Provider" RENAME TO "Provider_old";
ALTER TYPE "Provider_new" RENAME TO "Provider";
DROP TYPE "public"."Provider_old";
COMMIT;

-- AlterTable
ALTER TABLE "Identity" DROP COLUMN "data",
ADD COLUMN     "data" JSONB;
