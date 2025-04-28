/*
  Warnings:

  - You are about to drop the `SocialAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SocialAccount" DROP CONSTRAINT "SocialAccount_userId_fkey";

-- DropTable
DROP TABLE "SocialAccount";
