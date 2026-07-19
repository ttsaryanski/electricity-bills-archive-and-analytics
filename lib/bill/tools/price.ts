import { BillWithAddressAndConsumption } from "@/interfaces/Bill";
import { Price } from "@/interfaces/Price";

function startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function priceForBills(
    bills: BillWithAddressAndConsumption[],
    prices: Price[],
) {
    const normalizedBills = [...bills]
        .map((bill) => ({
            ...bill,
            period: startOfMonth(new Date(bill.period)),
        }))
        .sort((a, b) => a.period.getTime() - b.period.getTime());

    const normalizedPrices = [...prices]
        .map((price) => ({
            ...price,
            period_start: startOfMonth(new Date(price.period_start)),
            period_end: startOfMonth(new Date(price.period_end)),
        }))
        .sort((a, b) => a.period_start.getTime() - b.period_start.getTime());

    let isPriceUp: boolean = false;
    let lastDayPrice: number | null = null;
    let lastNightPrice: number | null = null;
    let lastBillDayPrice: number | null = null;
    let lastBillNightPrice: number | null = null;
    let isLastPriceLastBillPrice: boolean = false;

    if (normalizedPrices.length === 0) {
        return {
            isPriceUp,
            lastDayPrice,
            lastNightPrice,
            lastBillDayPrice,
            lastBillNightPrice,
            isLastPriceLastBillPrice,
            lastPriceStart: null,
        };
    }

    const lastPriceStart =
        normalizedPrices[normalizedPrices.length - 1]?.period_start || null;

    if (normalizedPrices.length >= 2) {
        isPriceUp =
            Number(normalizedPrices[normalizedPrices.length - 1]?.day_price) >
            Number(normalizedPrices[normalizedPrices.length - 2]?.day_price);
    }

    if (normalizedPrices.length > 0) {
        lastDayPrice = Number(
            normalizedPrices[normalizedPrices.length - 1]?.day_price,
        );
        lastNightPrice = Number(
            normalizedPrices[normalizedPrices.length - 1]?.night_price,
        );
    }

    if (normalizedBills.length > 0) {
        const lastBill = normalizedBills[normalizedBills.length - 1];
        const lastBillPeriod = lastBill.period;

        let matchedPriceIndex = -1;
        for (let i = normalizedPrices.length - 1; i >= 0; i--) {
            const periodStart = normalizedPrices[i].period_start;
            const periodEnd = normalizedPrices[i].period_end;

            if (lastBillPeriod >= periodStart && lastBillPeriod <= periodEnd) {
                matchedPriceIndex = i;
                break;
            }
        }

        if (matchedPriceIndex === -1) {
            for (let i = normalizedPrices.length - 1; i >= 0; i--) {
                if (normalizedPrices[i].period_start <= lastBillPeriod) {
                    matchedPriceIndex = i;
                    break;
                }
            }
        }

        if (matchedPriceIndex !== -1) {
            lastBillDayPrice = Number(
                normalizedPrices[matchedPriceIndex]?.day_price,
            );
            lastBillNightPrice = Number(
                normalizedPrices[matchedPriceIndex]?.night_price,
            );
            isLastPriceLastBillPrice =
                matchedPriceIndex === normalizedPrices.length - 1;
        }
    }

    return {
        isPriceUp,
        lastDayPrice,
        lastNightPrice,
        lastBillDayPrice,
        lastBillNightPrice,
        isLastPriceLastBillPrice,
        lastPriceStart,
    };
}
