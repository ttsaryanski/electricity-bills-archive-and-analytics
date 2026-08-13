import { prisma } from "@/lib/prisma";

import { CreateBillInput } from "@/validators/bill.schema";

type CreateBillData = CreateBillInput & {
    userId: string;
    total_consumption_kwh: number;
};
export async function createBill(data: CreateBillData) {
    const existingBill = await prisma.bill.findFirst({
        where: {
            month: data.month,
            year: data.year,
            userId: data.userId,
            addressId: data.addressId,
        },
    });
    if (existingBill) {
        return {
            success: false,
            message: "Bill for this month already exists",
        };
    }

    await prisma.bill.create({
        data,
    });

    return { success: true, message: "Bill created successfully" };
}

export async function getAllBillsCountWithQuery(where: {
    userId: string;
    addressId?: string;
    year?: number;
}) {
    return prisma.bill.count({
        where,
    });
}

export async function getAllBillsWithQuery(
    where: {
        userId: string;
        addressId?: string;
        year?: number;
    },
    page: number,
    pageSize: number,
) {
    return prisma.bill.findMany({
        where,
        orderBy: [{ year: "desc" }, { month: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
    });
}

export async function deleteBillById(billId: string, userId: string) {
    const existingBill = await prisma.bill.findFirst({
        where: { id: billId, userId },
    });

    if (!existingBill) {
        return {
            success: false,
            message: "Bill not found",
        };
    }

    await prisma.bill.delete({
        where: {
            id: billId,
            userId,
        },
    });

    return {
        success: true,
        message: "Bill deleted successfully",
    };
}

export async function getBillById(billId: string, userId: string) {
    return prisma.bill.findFirst({
        where: {
            id: billId,
            userId,
        },
        select: {
            id: true,
            month: true,
            year: true,
            period: true,
            total: true,
            day_consumption_kwh: true,
            night_consumption_kwh: true,
            address: {
                select: {
                    address: true,
                },
            },
        },
    });
}

export async function editBill(
    billId: string,
    userId: string,
    data: {
        total: number;
        day_consumption_kwh: number;
        night_consumption_kwh: number;
        total_consumption_kwh: number;
    },
) {
    const existingBill = await prisma.bill.findFirst({
        where: { id: billId, userId },
    });

    if (!existingBill) {
        return {
            success: false,
            message: "Bill not found",
            path: "editing",
        };
    }

    await prisma.bill.update({
        where: {
            id: billId,
            userId,
        },
        data: {
            total: data.total,
            day_consumption_kwh: data.day_consumption_kwh,
            night_consumption_kwh: data.night_consumption_kwh,
            total_consumption_kwh: data.total_consumption_kwh,
        },
    });

    return {
        success: true,
        message: "Bill updated successfully",
        path: "editing",
    };
}

export async function getTotalBills(userId: string, addressId: string) {
    return prisma.bill.findMany({
        where: { userId, addressId },
        orderBy: [{ year: "asc" }, { month: "asc" }],
        select: {
            period: true,
            day_consumption_kwh: true,
            night_consumption_kwh: true,
            total_consumption_kwh: true,
            total: true,
        },
    });
}

export async function getDemoTotalBills(addressId: string) {
    return prisma.bill.findMany({
        where: { addressId },
        orderBy: [{ year: "asc" }, { month: "asc" }],
        select: {
            period: true,
            day_consumption_kwh: true,
            night_consumption_kwh: true,
            total_consumption_kwh: true,
            total: true,
        },
    });
}

export async function getAllBillsCount(userId: string, addressId: string) {
    return prisma.bill.count({
        where: { userId, addressId },
    });
}
