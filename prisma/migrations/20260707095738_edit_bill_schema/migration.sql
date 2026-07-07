-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "day_consumption_kwh" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nigth_consumption_kwh" INTEGER NOT NULL DEFAULT 0;
