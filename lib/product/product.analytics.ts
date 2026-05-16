import { getTotalProducts } from "@/repositories/product.repository";

export async function getWeeklyProductsData(userId: string) {
    const products = await getTotalProducts(userId);

    const now = new Date();
    const weeklyProductsData = [];

    for (let i = 11; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - i * 7);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const weekLabel = `${String(weekStart.getMonth() + 1).padStart(
            2,
            "0",
        )}/${String(weekStart.getDate() + 1).padStart(2, "0")}`;

        const weekProducts = products.filter((product) => {
            const productDate = new Date(product.createdAt);
            return productDate >= weekStart && productDate <= weekEnd;
        });

        weeklyProductsData.push({
            week: weekLabel,
            products: weekProducts.length,
        });
    }

    return weeklyProductsData;
}
