/*
  Warnings:

  - You are about to alter the column `day_price` on the `Price` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(8,5)`.
  - You are about to alter the column `night_price` on the `Price` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(8,5)`.

*/
-- AlterTable
ALTER TABLE "Price" ALTER COLUMN "day_price" SET DATA TYPE DECIMAL(8,5),
ALTER COLUMN "night_price" SET DATA TYPE DECIMAL(8,5);
