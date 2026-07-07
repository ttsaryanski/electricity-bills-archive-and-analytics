import { getTotalBills } from "@/repositories/bill.repository";

export async function getMonthlyBillsData(userId: string, addressId: string) {
    const bills = await getTotalBills(userId, addressId);

    const now = new Date();
    const monthlyBillsData = [];

    for (let i = 11; i >= 0; i--) {
        const monthStart = new Date(
            now.getFullYear(),
            now.getMonth() - i,
            1,
            0,
            0,
            0,
            0,
        );

        const monthEnd = new Date(
            now.getFullYear(),
            now.getMonth() - i + 1,
            0,
            23,
            59,
            59,
            999,
        );

        const monthLabel = `${String(monthStart.getMonth() + 1).padStart(2, "0")}/${monthStart.getFullYear()}`;

        monthlyBillsData.push({
            month: monthLabel,
            day_consumption_kwh: bills
                .filter((bill) => {
                    const billDate = new Date(bill.period);
                    return billDate >= monthStart && billDate <= monthEnd;
                })
                .reduce(
                    (acc, bill) => acc + Number(bill.day_consumption_kwh),
                    0,
                ),
            night_consumption_kwh: bills
                .filter((bill) => {
                    const billDate = new Date(bill.period);
                    return billDate >= monthStart && billDate <= monthEnd;
                })
                .reduce(
                    (acc, bill) => acc + Number(bill.night_consumption_kwh),
                    0,
                ),
            bills: bills
                .filter((bill) => {
                    const billDate = new Date(bill.period);
                    return billDate >= monthStart && billDate <= monthEnd;
                })
                .reduce((acc, bill) => acc + Number(bill.total), 0),
        });
    }

    return monthlyBillsData;
}
