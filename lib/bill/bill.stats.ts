import { getAllPrices } from "../../repositories/price.repository";
import {
    getTotalBills,
    getDemoTotalBills,
} from "../../repositories/bill.repository";

import { metricsForBills } from "./tools/metrics";
import { priceForBills } from "./tools/price";

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

    const sortedBills = bills.sort(
        (a, b) => b.total_consumption_kwh - a.total_consumption_kwh,
    );
    const slicedBills =
        sortedBills.length >= 6
            ? [...sortedBills.slice(0, 3), ...sortedBills.slice(-3)]
            : sortedBills.length > 3
              ? [...sortedBills.slice(0, 2), ...sortedBills.slice(-2)]
              : sortedBills.length > 1 && sortedBills.length <= 3
                ? [...sortedBills.slice(0, 1), ...sortedBills.slice(-1)]
                : sortedBills;

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

    let {
        isPriceUp,
        lastDayPrice,
        lastNightPrice,
        lastBillDayPrice,
        lastBillNightPrice,
        isLastPriceLastBillPrice,
        lastPriceStart,
    } = priceForBills(bills, prices);

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
        lastBillDayPrice,
        lastBillNightPrice,
        isLastPriceLastBillPrice,
        lastPriceStart,
        slicedBills,
    };
}

export async function getDemoDashboardStats(addressId: string) {
    const totalBills = await getDemoTotalBills(addressId);
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

    const sortedBills = bills.sort(
        (a, b) => b.total_consumption_kwh - a.total_consumption_kwh,
    );
    const slicedBills =
        sortedBills.length >= 6
            ? [...sortedBills.slice(0, 3), ...sortedBills.slice(-3)]
            : sortedBills.length > 3
              ? [...sortedBills.slice(0, 2), ...sortedBills.slice(-2)]
              : sortedBills.length > 1 && sortedBills.length <= 3
                ? [...sortedBills.slice(0, 1), ...sortedBills.slice(-1)]
                : sortedBills;

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

    let {
        isPriceUp,
        lastDayPrice,
        lastNightPrice,
        lastBillDayPrice,
        lastBillNightPrice,
        isLastPriceLastBillPrice,
        lastPriceStart,
    } = priceForBills(bills, prices);

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
        lastBillDayPrice,
        lastBillNightPrice,
        isLastPriceLastBillPrice,
        lastPriceStart,
        slicedBills,
    };
}
