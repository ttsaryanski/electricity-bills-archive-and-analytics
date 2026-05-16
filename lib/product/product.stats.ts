import {
    getAllProductsCount,
    getLowStockProductsCount,
    getTotalProducts,
    getRecentProducts,
} from "../../repositories/product.repository";

export async function getDashboardStats(userId: string) {
    const [productsCount, lowStock, totalProducts, recentProducts] =
        await Promise.all([
            getAllProductsCount(userId),
            getLowStockProductsCount(userId),
            getTotalProducts(userId),
            getRecentProducts(userId),
        ]);

    const totalValue = totalProducts.reduce(
        (sum, product) =>
            sum + Number(product.price) * Number(product.quantity),
        0,
    );

    const inStockCount = totalProducts.filter(
        (p) => Number(p.quantity) > 5,
    ).length;
    const inStockPercentage =
        productsCount > 0
            ? Math.round((inStockCount / productsCount) * 100)
            : 0;

    const lowStockCount = totalProducts.filter(
        (p) => Number(p.quantity) <= 5 && Number(p.quantity) >= 1,
    ).length;
    const lowStockPercentage =
        productsCount > 0
            ? Math.round((lowStockCount / productsCount) * 100)
            : 0;

    const outOfStockCount = totalProducts.filter(
        (p) => Number(p.quantity) === 0,
    ).length;
    const outOfStockPercentage =
        productsCount > 0
            ? Math.round((outOfStockCount / productsCount) * 100)
            : 0;

    return {
        productsCount,
        lowStock,
        totalProducts,
        recentProducts,
        totalValue,
        inStockCount,
        inStockPercentage,
        lowStockCount,
        lowStockPercentage,
        outOfStockCount,
        outOfStockPercentage,
    };
}
