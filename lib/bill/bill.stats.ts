import {
    getAllProductsCount,
    getLowStockProductsCount,
    getTotalProducts,
    getRecentProducts,
} from "../../repositories/product.repository";
import { getAllPrices } from "../../repositories/price.repository";

import {
    getAllBillsCount,
    getTotalBills,
} from "../../repositories/bill.repository";

import { metricsForBills } from "./tools/metrics";
import { effeciencyForBills } from "./tools/effeciency";

export async function getBillDashboardStats(userId: string, addressId: string) {
    const totalBills = await getTotalBills(userId, addressId);
    const totalPrices = await getAllPrices();
    const bills = totalBills.map((bill) => ({
        ...bill,
        total: Number(bill.total),
    }));
    const prices = totalPrices.map((price) => ({
        ...price,
        day_price: Number(price.day_price),
        night_price: Number(price.night_price),
    }));

    let {
        billsForLastMonthCount,
        isUp,
        growthPercentage,
        growthConsumptionPercentage,
        isConsUp,
        targetPeriod,
        avgTotalBill,
        isAvgUp,
        avgBillPercentage,
        lastBill,
        isHasLastBill,
        isConsumptionUp,
        avgTotalConsumpion,
        avgConsumptionPercentage,
        lastConsumption,
    } = metricsForBills(bills);

    let { isPriceUp, lastDayPrice, lastNightPrice } = effeciencyForBills(
        bills,
        prices,
    );

    ////////////////////////////////////////////////////

    const [productsCount, lowStock, totalProductsPrisma, recentProductsPrisma] =
        await Promise.all([
            getAllProductsCount(userId),
            getLowStockProductsCount(userId),
            getTotalProducts(userId),
            getRecentProducts(userId),
        ]);

    const totalProducts = totalProductsPrisma.map((product) => ({
        price: Number(product.price),
        quantity: product.quantity,
        createdAt: product.createdAt,
    }));

    const recentProducts = recentProductsPrisma.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: Number(product.price),
        quantity: product.quantity,
        lowStockAt: product.lowStockAt,
        userId: product.userId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    }));

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
        billsForLastMonthCount,
        isUp,
        isConsUp,
        growthPercentage,
        growthConsumptionPercentage,
        targetPeriod,
        avgTotalBill,
        isAvgUp,
        avgBillPercentage,
        lastBill,
        isHasLastBill,
        isConsumptionUp,
        avgTotalConsumpion,
        avgConsumptionPercentage,
        lastConsumption,
        isPriceUp,
        lastDayPrice,
        lastNightPrice,
        ////////////////
        productsCount,
        lowStock,
        totalValue,
        inStockCount,
        inStockPercentage,
        lowStockCount,
        lowStockPercentage,
        outOfStockCount,
        outOfStockPercentage,
        recentProducts,
    };
}
