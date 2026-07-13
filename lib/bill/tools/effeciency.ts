import { BillWithAddressAndConsumption } from "@/interfaces/Bill";
import { Price } from "@/interfaces/Price";

export function effeciencyForBills(
    bills: BillWithAddressAndConsumption[],
    prices: Price[],
) {
    let isPriceUp: boolean = false;
    let lastDayPrice: number | null = null;
    let lastNightPrice: number | null = null;

    if (prices.length === 0) {
        return {
            isPriceUp,
            lastDayPrice,
            lastNightPrice,
        };
    }

    if (prices.length >= 2) {
        isPriceUp =
            Number(prices[prices.length - 1]?.day_price) >
            Number(prices[prices.length - 2]?.day_price);
    }

    if (prices.length >= 1) {
        lastDayPrice = Number(prices[prices.length - 1]?.day_price);
        lastNightPrice = Number(prices[prices.length - 1]?.night_price);
    }

    return {
        isPriceUp,
        lastDayPrice,
        lastNightPrice,
    };
}
