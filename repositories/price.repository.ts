import { prisma } from "@/lib/prisma";

export async function getAllPrices() {
    return prisma.price.findMany({
        select: {
            period_start: true,
            period_end: true,
            day_price: true,
            night_price: true,
        },
        orderBy: [{ period_end: "asc" }],
    });
}
