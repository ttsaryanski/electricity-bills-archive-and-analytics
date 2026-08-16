import {
    getDemoTotalBills,
    getTotalBills,
} from "@/repositories/bill.repository";
import { getAllPrices } from "../../repositories/price.repository";

export type AnalyticsPeriod = {
    label: string;
    priceChangePct: number | null;
    consumptionChangePct: number | null;
    billChangePct: number | null;
};

export type AnalyticsResult =
    | { status: "ok"; data: AnalyticsPeriod[] }
    | { status: "no-data"; data: AnalyticsPeriod[] };

function startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function toPeriodLabel(months: Date[]): string {
    if (months.length === 0) return "";
    const sorted = [...months].sort((a, b) => a.getTime() - b.getTime());
    const fmt = (d: Date) =>
        `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    return `${fmt(sorted[0])} - ${fmt(sorted[sorted.length - 1])}`;
}

function percentageChange(current: number, previous: number): number | null {
    if (previous === 0) return null;
    return Number((((current - previous) / previous) * 100).toFixed(2));
}

function isSameHalfYear(month: number, referenceMonth: number): boolean {
    const refHalf = referenceMonth < 6 ? 0 : 1; // 0..5 or 6..11
    const mHalf = month < 6 ? 0 : 1;
    return refHalf === mHalf;
}

function getComparableKey(date: Date): string {
    return String(date.getMonth() + 1).padStart(2, "0");
}

type MonthlyValue = { consumption: number; bill: number; date: Date };

type PeriodMetrics = {
    priceIndex: number;
    avgPrice: number;
    monthlyMap: Map<string, MonthlyValue>;
    label: string;
};

function buildMonthlyMapForPricePeriod(
    bills: Array<{
        total: number;
        total_consumption_kwh: number;
        period: Date;
    }>,
    periodStart: Date,
    periodEnd: Date,
    latestHalfMonth: number,
): Map<string, MonthlyValue> {
    const monthlyMap = new Map<string, MonthlyValue>();

    for (const bill of bills) {
        if (bill.period < periodStart || bill.period > periodEnd) continue;
        if (!isSameHalfYear(bill.period.getMonth(), latestHalfMonth)) continue;

        const key = getComparableKey(bill.period);
        const existing = monthlyMap.get(key);
        if (existing) {
            existing.consumption += bill.total_consumption_kwh;
            existing.bill += bill.total;
        } else {
            monthlyMap.set(key, {
                consumption: bill.total_consumption_kwh,
                bill: bill.total,
                date: bill.period,
            });
        }
    }

    return monthlyMap;
}

export async function getPeriodicData(
    userId: string,
    addressId: string,
): Promise<AnalyticsResult> {
    const totalBills = await getTotalBills(userId, addressId);
    const totalPrices = await getAllPrices();

    if (totalBills.length === 0 || totalPrices.length === 0) {
        return { status: "no-data", data: [] };
    }

    const bills = totalBills.map((b) => ({
        ...b,
        total: Number(b.total),
        total_consumption_kwh: Number(b.total_consumption_kwh),
        period: startOfMonth(new Date(b.period)),
    }));

    const prices = totalPrices
        .map((p) => ({
            ...p,
            day_price: Number(p.day_price),
            night_price: Number(p.night_price),
            period_start: startOfMonth(new Date(p.period_start)),
            period_end: startOfMonth(new Date(p.period_end)),
        }))
        .sort((a, b) => a.period_start.getTime() - b.period_start.getTime());

    const latestBill = [...bills].sort(
        (a, b) => b.period.getTime() - a.period.getTime(),
    )[0];

    const latestHalfMonth = latestBill.period.getMonth();

    let latestPriceIndex = prices.findIndex(
        (p) =>
            latestBill.period >= p.period_start &&
            latestBill.period <= p.period_end,
    );

    if (latestPriceIndex === -1) {
        latestPriceIndex = prices.findLastIndex(
            (p) => p.period_end <= latestBill.period,
        );
    }

    if (latestPriceIndex < 0) {
        return { status: "no-data", data: [] };
    }

    // Pick up to 3 relevant price periods (latest and previous),
    // but only if they have bills in the same half-year.
    const selectedIndices: number[] = [];
    for (
        let idx = latestPriceIndex;
        idx >= 0 && selectedIndices.length < 3;
        idx--
    ) {
        const price = prices[idx];
        const hasBills = bills.some(
            (b) =>
                b.period >= price.period_start &&
                b.period <= price.period_end &&
                isSameHalfYear(b.period.getMonth(), latestHalfMonth),
        );
        if (hasBills) selectedIndices.push(idx);
    }

    // Need at least 2 periods for at least one comparison.
    if (selectedIndices.length < 2) {
        return { status: "no-data", data: [] };
    }

    // Oldest -> newest so latest stays LAST in result
    selectedIndices.sort((a, b) => a - b);

    const monthlyMapCache = new Map<number, Map<string, MonthlyValue>>();

    const periodData: PeriodMetrics[] = selectedIndices.map((priceIndex) => {
        const price = prices[priceIndex];
        const monthlyMap = buildMonthlyMapForPricePeriod(
            bills,
            price.period_start,
            price.period_end,
            latestHalfMonth,
        );
        monthlyMapCache.set(priceIndex, monthlyMap);

        const avgPrice = Number(
            ((price.day_price + price.night_price) / 2).toFixed(5),
        );
        const months = Array.from(monthlyMap.values()).map((m) => m.date);

        return {
            priceIndex,
            avgPrice,
            monthlyMap,
            label: toPeriodLabel(months),
        };
    });

    // Use the smallest month match as benchmark (etalon) across selected periods.
    // This prevents skew by forcing all consumption/bill comparisons to analogous months only.
    const benchmarkPeriod = periodData
        .filter((p) => p.monthlyMap.size > 0)
        .sort((a, b) => {
            if (a.monthlyMap.size !== b.monthlyMap.size) {
                return a.monthlyMap.size - b.monthlyMap.size;
            }

            // Prefer the newest period when month counts are equal.
            return b.priceIndex - a.priceIndex;
        })[0];

    const benchmarkMonthKeys = new Set(
        benchmarkPeriod ? Array.from(benchmarkPeriod.monthlyMap.keys()) : [],
    );

    if (benchmarkMonthKeys.size === 0) {
        return { status: "no-data", data: [] };
    }

    const result: AnalyticsPeriod[] = periodData.map((curr) => {
        let priceChangePct: number | null = null;
        let consumptionChangePct: number | null = null;
        let billChangePct: number | null = null;
        const comparableMonths = Array.from(curr.monthlyMap.values())
            .filter((m) => benchmarkMonthKeys.has(getComparableKey(m.date)))
            .map((m) => m.date);
        const comparableLabel = toPeriodLabel(comparableMonths);

        // Price comparison with immediate previous PRICE period (fallback by index)
        // to avoid broken chain when periods are irregular.
        for (let p = curr.priceIndex - 1; p >= 0; p--) {
            const prevPriceAvg = Number(
                ((prices[p].day_price + prices[p].night_price) / 2).toFixed(5),
            );
            priceChangePct = percentageChange(curr.avgPrice, prevPriceAvg);
            break;
        }

        // Consumption/Bill comparison with nearest previous PRICE period
        // (fallback by index), including periods outside the selected 3.
        for (let p = curr.priceIndex - 1; p >= 0; p--) {
            let prevMonthlyMap = monthlyMapCache.get(p);
            if (!prevMonthlyMap) {
                prevMonthlyMap = buildMonthlyMapForPricePeriod(
                    bills,
                    prices[p].period_start,
                    prices[p].period_end,
                    latestHalfMonth,
                );
                monthlyMapCache.set(p, prevMonthlyMap);
            }

            const sharedKeys = Array.from(curr.monthlyMap.keys()).filter(
                (k) => prevMonthlyMap.has(k) && benchmarkMonthKeys.has(k),
            );

            if (sharedKeys.length === 0) continue;

            const currCons = sharedKeys.reduce(
                (s, k) => s + curr.monthlyMap.get(k)!.consumption,
                0,
            );
            const prevCons = sharedKeys.reduce(
                (s, k) => s + prevMonthlyMap.get(k)!.consumption,
                0,
            );
            const currBill = sharedKeys.reduce(
                (s, k) => s + curr.monthlyMap.get(k)!.bill,
                0,
            );
            const prevBill = sharedKeys.reduce(
                (s, k) => s + prevMonthlyMap.get(k)!.bill,
                0,
            );

            consumptionChangePct = percentageChange(currCons, prevCons);
            billChangePct = percentageChange(currBill, prevBill);
            break;
        }

        return {
            label: comparableLabel,
            priceChangePct,
            consumptionChangePct,
            billChangePct,
        };
    });

    const hasAnyFullComparison = result.some(
        (r) =>
            r.priceChangePct !== null &&
            r.consumptionChangePct !== null &&
            r.billChangePct !== null,
    );

    if (!hasAnyFullComparison) {
        return { status: "no-data", data: [] };
    }

    return { status: "ok", data: result };
}

export async function getDemoPeriodicData(
    addressId: string,
): Promise<AnalyticsResult> {
    const totalBills = await getDemoTotalBills(addressId);
    const totalPrices = await getAllPrices();

    if (totalBills.length === 0 || totalPrices.length === 0) {
        return { status: "no-data", data: [] };
    }

    const bills = totalBills.map((b) => ({
        ...b,
        total: Number(b.total),
        total_consumption_kwh: Number(b.total_consumption_kwh),
        period: startOfMonth(new Date(b.period)),
    }));

    const prices = totalPrices
        .map((p) => ({
            ...p,
            day_price: Number(p.day_price),
            night_price: Number(p.night_price),
            period_start: startOfMonth(new Date(p.period_start)),
            period_end: startOfMonth(new Date(p.period_end)),
        }))
        .sort((a, b) => a.period_start.getTime() - b.period_start.getTime());

    const latestBill = [...bills].sort(
        (a, b) => b.period.getTime() - a.period.getTime(),
    )[0];

    const latestHalfMonth = latestBill.period.getMonth();

    let latestPriceIndex = prices.findIndex(
        (p) =>
            latestBill.period >= p.period_start &&
            latestBill.period <= p.period_end,
    );

    if (latestPriceIndex === -1) {
        latestPriceIndex = prices.findLastIndex(
            (p) => p.period_end <= latestBill.period,
        );
    }

    if (latestPriceIndex < 0) {
        return { status: "no-data", data: [] };
    }

    // Pick up to 3 relevant price periods (latest and previous),
    // but only if they have bills in the same half-year.
    const selectedIndices: number[] = [];
    for (
        let idx = latestPriceIndex;
        idx >= 0 && selectedIndices.length < 3;
        idx--
    ) {
        const price = prices[idx];
        const hasBills = bills.some(
            (b) =>
                b.period >= price.period_start &&
                b.period <= price.period_end &&
                isSameHalfYear(b.period.getMonth(), latestHalfMonth),
        );
        if (hasBills) selectedIndices.push(idx);
    }

    // Need at least 2 periods for at least one comparison.
    if (selectedIndices.length < 2) {
        return { status: "no-data", data: [] };
    }

    // Oldest -> newest so latest stays LAST in result
    selectedIndices.sort((a, b) => a - b);

    const monthlyMapCache = new Map<number, Map<string, MonthlyValue>>();

    const periodData: PeriodMetrics[] = selectedIndices.map((priceIndex) => {
        const price = prices[priceIndex];
        const monthlyMap = buildMonthlyMapForPricePeriod(
            bills,
            price.period_start,
            price.period_end,
            latestHalfMonth,
        );
        monthlyMapCache.set(priceIndex, monthlyMap);

        const avgPrice = Number(
            ((price.day_price + price.night_price) / 2).toFixed(5),
        );
        const months = Array.from(monthlyMap.values()).map((m) => m.date);

        return {
            priceIndex,
            avgPrice,
            monthlyMap,
            label: toPeriodLabel(months),
        };
    });

    // Use the smallest month match as benchmark (etalon) across selected periods.
    // This prevents skew by forcing all consumption/bill comparisons to analogous months only.
    const benchmarkPeriod = periodData
        .filter((p) => p.monthlyMap.size > 0)
        .sort((a, b) => {
            if (a.monthlyMap.size !== b.monthlyMap.size) {
                return a.monthlyMap.size - b.monthlyMap.size;
            }

            // Prefer the newest period when month counts are equal.
            return b.priceIndex - a.priceIndex;
        })[0];

    const benchmarkMonthKeys = new Set(
        benchmarkPeriod ? Array.from(benchmarkPeriod.monthlyMap.keys()) : [],
    );

    if (benchmarkMonthKeys.size === 0) {
        return { status: "no-data", data: [] };
    }

    const result: AnalyticsPeriod[] = periodData.map((curr) => {
        let priceChangePct: number | null = null;
        let consumptionChangePct: number | null = null;
        let billChangePct: number | null = null;
        const comparableMonths = Array.from(curr.monthlyMap.values())
            .filter((m) => benchmarkMonthKeys.has(getComparableKey(m.date)))
            .map((m) => m.date);
        const comparableLabel = toPeriodLabel(comparableMonths);

        // Price comparison with immediate previous PRICE period (fallback by index)
        // to avoid broken chain when periods are irregular.
        for (let p = curr.priceIndex - 1; p >= 0; p--) {
            const prevPriceAvg = Number(
                ((prices[p].day_price + prices[p].night_price) / 2).toFixed(5),
            );
            priceChangePct = percentageChange(curr.avgPrice, prevPriceAvg);
            break;
        }

        // Consumption/Bill comparison with nearest previous PRICE period
        // (fallback by index), including periods outside the selected 3.
        for (let p = curr.priceIndex - 1; p >= 0; p--) {
            let prevMonthlyMap = monthlyMapCache.get(p);
            if (!prevMonthlyMap) {
                prevMonthlyMap = buildMonthlyMapForPricePeriod(
                    bills,
                    prices[p].period_start,
                    prices[p].period_end,
                    latestHalfMonth,
                );
                monthlyMapCache.set(p, prevMonthlyMap);
            }

            const sharedKeys = Array.from(curr.monthlyMap.keys()).filter(
                (k) => prevMonthlyMap.has(k) && benchmarkMonthKeys.has(k),
            );

            if (sharedKeys.length === 0) continue;

            const currCons = sharedKeys.reduce(
                (s, k) => s + curr.monthlyMap.get(k)!.consumption,
                0,
            );
            const prevCons = sharedKeys.reduce(
                (s, k) => s + prevMonthlyMap.get(k)!.consumption,
                0,
            );
            const currBill = sharedKeys.reduce(
                (s, k) => s + curr.monthlyMap.get(k)!.bill,
                0,
            );
            const prevBill = sharedKeys.reduce(
                (s, k) => s + prevMonthlyMap.get(k)!.bill,
                0,
            );

            consumptionChangePct = percentageChange(currCons, prevCons);
            billChangePct = percentageChange(currBill, prevBill);
            break;
        }

        return {
            label: comparableLabel,
            priceChangePct,
            consumptionChangePct,
            billChangePct,
        };
    });

    const hasAnyFullComparison = result.some(
        (r) =>
            r.priceChangePct !== null &&
            r.consumptionChangePct !== null &&
            r.billChangePct !== null,
    );

    if (!hasAnyFullComparison) {
        return { status: "no-data", data: [] };
    }

    return { status: "ok", data: result };
}
