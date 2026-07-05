import { prisma } from "@/lib/prisma";

import { CreateBillInput } from "@/validators/bill.schema";

type CreateBillData = CreateBillInput & {
    userId: string;
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
        throw new Error("Bill for this month already exists");
    }

    await prisma.bill.create({
        data,
    });
}

export async function getAllBillsCountWithQuery(where: {
    userId: string;
    year?: number;
}) {
    return prisma.bill.count({
        where,
    });
}

export async function getAllBillsWithQuery(
    where: {
        userId: string;
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
    await prisma.bill.delete({
        where: {
            id: billId,
            userId,
        },
    });
}

export async function getBillById(billId: string) {
    return prisma.bill.findUnique({
        where: {
            id: billId,
        },
        select: {
            id: true,
            month: true,
            year: true,
            period: true,
            total: true,
            address: {
                select: {
                    address: true,
                },
            },
        },
    });
}

export async function editBill(billId: string, total: number) {
    const existingBill = await prisma.bill.findFirst({
        where: { id: billId },
    });
    if (!existingBill) {
        throw new Error("Bill not found");
    }

    await prisma.bill.update({
        where: {
            id: billId,
        },
        data: {
            total: total,
        },
    });
}
