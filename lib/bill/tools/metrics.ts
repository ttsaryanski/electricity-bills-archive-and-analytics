import { BillWithAddressAndConsumption } from "@/interfaces/Bill";

export function metricsForBills(bills: BillWithAddressAndConsumption[]) {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    const targetPeriod = new Date(Date.UTC(currentYear, currentMonth - 2, 1));
    const targetBills = bills.filter(
        (bill) => bill.period.getMonth() === targetPeriod.getMonth(),
    );

    let isUp: boolean = false;
    let isConsUp: boolean = false;
    let isAvgUp: boolean = false;
    let isConsumptionUp: boolean = false;
    let growthPercentage: number | null = null;
    let growthConsumptionPercentage: number | null = null;
    let avgBillPercentage: number | null = null;
    let avgConsumptionPercentage: number | null = null;
    let avgTotalBill: number | null = null;
    let avgTotalConsumpion: number | null = null;
    let lastBill: number | null = null;
    let lastConsumption: number | null = null;
    let isHasLastBill: boolean = false;

    if (targetBills.length === 0) {
        return {
            billsForLastMonthCount: 0,
            isUp,
            isConsUp,
            isConsumptionUp,
            growthPercentage,
            growthConsumptionPercentage,
            targetPeriod: targetPeriod.toLocaleString("en-US", {
                month: "long",
                year: "numeric",
            }),
            avgTotalBill,
            avgTotalConsumpion,
            isAvgUp,
            avgBillPercentage,
            avgConsumptionPercentage,
            lastBill,
            isHasLastBill,
        };
    }

    lastBill = targetBills[targetBills.length - 1].total;
    lastConsumption = targetBills[targetBills.length - 1].total_consumption_kwh;
    isHasLastBill =
        targetBills.filter((bill) => bill.period.getFullYear() === currentYear)
            .length > 0;

    if (targetBills.length >= 2) {
        isUp =
            Number(targetBills[targetBills.length - 1]?.total) >
            Number(targetBills[targetBills.length - 2]?.total);

        growthPercentage =
            ((Number(targetBills[targetBills.length - 1]?.total) -
                Number(targetBills[targetBills.length - 2]?.total)) /
                Number(targetBills[targetBills.length - 2]?.total)) *
            100;

        isConsUp =
            Number(targetBills[targetBills.length - 1]?.total_consumption_kwh) >
            Number(targetBills[targetBills.length - 2]?.total_consumption_kwh);

        growthConsumptionPercentage =
            ((Number(
                targetBills[targetBills.length - 1]?.total_consumption_kwh,
            ) -
                Number(
                    targetBills[targetBills.length - 2]?.total_consumption_kwh,
                )) /
                Number(
                    targetBills[targetBills.length - 2]?.total_consumption_kwh,
                )) *
            100;
    } else {
        isUp = targetBills.length === 1;
        growthPercentage = null;
        growthConsumptionPercentage = null;
    }

    if (targetBills.length > 0) {
        avgTotalBill =
            targetBills.reduce((sum, bill) => sum + Number(bill.total), 0) /
            targetBills.length;
        isAvgUp = avgTotalBill < lastBill;
        avgBillPercentage = ((lastBill - avgTotalBill) / avgTotalBill) * 100;

        avgTotalConsumpion =
            targetBills.reduce(
                (sum, bill) => sum + Number(bill.total_consumption_kwh),
                0,
            ) / targetBills.length;
        isConsumptionUp = avgTotalConsumpion < lastConsumption;
        avgConsumptionPercentage =
            ((lastConsumption - avgTotalConsumpion) / avgTotalConsumpion) * 100;
    }

    return {
        billsForLastMonthCount: targetBills.length,
        isUp,
        isConsUp,
        growthPercentage,
        growthConsumptionPercentage,
        targetPeriod: targetPeriod.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
        }),
        avgTotalBill,
        isAvgUp,
        avgBillPercentage,
        lastBill,
        isHasLastBill,
        isConsumptionUp,
        avgTotalConsumpion,
        avgConsumptionPercentage,
        lastConsumption,
    };
}
