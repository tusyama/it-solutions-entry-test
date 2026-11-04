/*
  Warnings:

  - You are about to drop the column `isPrimary` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slot]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Profile_isPrimary_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "isPrimary",
ADD COLUMN     "slot" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_slot_key" ON "Profile"("slot");
