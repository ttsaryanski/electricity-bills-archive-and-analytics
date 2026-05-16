import { prisma } from "@/lib/prisma";

export async function getAllProductsCount(userId: string) {
    return prisma.product.count({
        where: { userId },
    });
}

export async function getLowStockProductsCount(userId: string) {
    return prisma.product.count({
        where: { userId, lowStockAt: { not: null }, quantity: { lte: 5 } },
    });
}

export async function getTotalProducts(userId: string) {
    return prisma.product.findMany({
        where: { userId },
        select: {
            price: true,
            quantity: true,
            createdAt: true,
        },
    });
}

export async function getRecentProducts(userId: string) {
    return prisma.product.findMany({
        where: { userId },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
    });
}
