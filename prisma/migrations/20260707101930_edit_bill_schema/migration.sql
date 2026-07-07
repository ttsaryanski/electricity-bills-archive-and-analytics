/*
  Warnings:

  - You are about to drop the column `nigth_consumption_kwh` on the `Bill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "nigth_consumption_kwh",
ADD COLUMN     "night_consumption_kwh" INTEGER NOT NULL DEFAULT 0;
