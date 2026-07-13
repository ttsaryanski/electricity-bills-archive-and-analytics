import { getTotalBills } from "@/repositories/bill.repository";

export async function getAllMonthlyBillsData(
    userId: string,
    addressId: string,
) {
    const bills = await getTotalBills(userId, addressId);

    if (bills.length === 0) {
        return [];
    }

    const totalsByYearMonth = new Map<string, number>();
    const averageByMonth = new Map<number, number>();

    const firstPeriod = new Date(bills[0].period);
    const lastPeriod = new Date(bills[bills.length - 1].period);

    const firstYear = firstPeriod.getUTCFullYear();
    const firstMonth = firstPeriod.getUTCMonth() + 1;
    const lastYear = lastPeriod.getUTCFullYear();
    const lastMonth = lastPeriod.getUTCMonth() + 1;

    for (const bill of bills) {
        const period = new Date(bill.period);
        const month = period.getUTCMonth() + 1;
        const year = period.getUTCFullYear();
        const monthYearKey = `${year}-${String(month).padStart(2, "0")}`;

        totalsByYearMonth.set(
            monthYearKey,
            (totalsByYearMonth.get(monthYearKey) ?? 0) + Number(bill.total),
        );
    }

    for (let month = 1; month <= 12; month++) {
        const monthTotals: number[] = [];

        for (const [monthYearKey, total] of totalsByYearMonth.entries()) {
            const keyMonth = Number(monthYearKey.split("-")[1]);
            if (keyMonth === month) {
                monthTotals.push(total);
            }
        }

        const average =
            monthTotals.length > 0
                ? monthTotals.reduce((sum, total) => sum + total, 0) /
                  monthTotals.length
                : 0;

        averageByMonth.set(month, Number(average.toFixed(2)));
    }

    const monthDiff = (lastYear - firstYear) * 12 + (lastMonth - firstMonth);
    const monthlyAllBillsData = [];

    for (let i = 0; i <= monthDiff; i++) {
        const monthIndex = firstMonth - 1 + i;
        const year = firstYear + Math.floor(monthIndex / 12);
        const month = (monthIndex % 12) + 1;
        const monthYearKey = `${year}-${String(month).padStart(2, "0")}`;
        const monthLabel = `${String(month).padStart(2, "0")}/${year}`;

        monthlyAllBillsData.push({
            month: monthLabel,
            bill: totalsByYearMonth.get(monthYearKey) ?? 0,
            avg: averageByMonth.get(month) ?? 0,
        });
    }

    return monthlyAllBillsData;
}
