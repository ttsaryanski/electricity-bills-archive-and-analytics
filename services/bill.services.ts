"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getDemoAddress, getPrimaryAddress } from "@/services/address.services";

import { requireCurrentUser } from "@/lib/auth";
// import { checkBillRateLimit } from "@/lib/bill/bill.rate-limit";
import {
    getMonthlyBillsData,
    getDemoMonthlyBillsData,
} from "@/lib/bill/bill.analytics.year";
import {
    getAllMonthlyBillsData,
    getDemoAllMonthlyBillsData,
} from "@/lib/bill/bill.analytics.full";
import {
    getBillDashboardStats,
    getDemoDashboardStats,
} from "@/lib/bill/bill.stats";
import {
    getPeriodicData,
    getDemoPeriodicData,
} from "@/lib/price/price.analytics";

import {
    createBillSchema,
    yearQuerySchema,
    editBillSchema,
} from "@/validators/bill.schema";
import {
    createBill as createBillRepo,
    editBill as editBillRepo,
    deleteBillById as deleteBillRepo,
    getBillById as getBillByIdRepo,
    getAllBillsCountWithQuery,
    getAllBillsWithQuery,
    getAllBillsCount,
} from "@/repositories/bill.repository";

import { CreateBillInput } from "@/validators/bill.schema";

export async function createBill(data: CreateBillInput) {
    const user = await requireCurrentUser();

    const parsedData = createBillSchema.safeParse(data);
    if (!parsedData.success) {
        throw new Error(parsedData.error.issues[0].message);
    }

    try {
        await createBillRepo({
            ...parsedData.data,
            userId: user.id,
            total_consumption_kwh:
                parsedData.data.day_consumption_kwh +
                parsedData.data.night_consumption_kwh,
        });
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Failed to create bill",
        );
    }
}

export async function getBillsPaginated(
    query: string,
    page: number,
    pageSize: number,
) {
    const user = await requireCurrentUser();
    const primaryAddress = await getPrimaryAddress();

    // const success = checkBillRateLimit(user.id);
    // if (!success) {
    //     throw new Error("Rate limit exceeded");
    // }

    let where = {
        userId: user.id,
        addressId: primaryAddress?.id,
    };
    const queryNumber = Number(query);
    const isInteger = Number.isInteger(queryNumber);
    const parsedData = yearQuerySchema.safeParse({
        year: queryNumber,
    });
    if (!parsedData.success && query) {
        throw new Error(parsedData.error.issues[0].message);
    }
    if (isInteger) {
        where = {
            userId: user.id,
            addressId: primaryAddress?.id,
            ...(query ? { year: queryNumber } : {}),
        };
    } else {
        where = {
            userId: user.id,
            addressId: primaryAddress?.id,
        };
    }

    if (!primaryAddress) {
        throw new Error("Primary address not found");
    }

    const totalCount = await getAllBillsCountWithQuery(where);
    const bills = await getAllBillsWithQuery(where, page, pageSize);

    return {
        totalCount,
        bills,
    };
}

export async function deleteBill(billId: string) {
    const user = await requireCurrentUser();

    if (!billId) {
        throw new Error("Bill ID is required");
    }

    try {
        await deleteBillRepo(billId, user.id);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Failed to delete bill",
        );
    }
    revalidatePath("/bills");
}

export async function getBillById(billId: string) {
    try {
        const bill = await getBillByIdRepo(billId);
        if (!bill) {
            throw new Error("Bill not found");
        }

        return { ...bill, total: Number(bill.total) };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Failed to fetch bill",
        );
    }
}

type EditBillState = {
    success: boolean;
    message: string;
    path?: string;
};
export async function editBill(
    _prevState: EditBillState,
    formData: FormData,
    billId: string,
) {
    const parsedData = editBillSchema.safeParse({
        total: Number(formData.get("total")),
        day_consumption_kwh: Number(formData.get("day_consumption_kwh")),
        night_consumption_kwh: Number(formData.get("night_consumption_kwh")),
    });
    if (!parsedData.success) {
        return {
            success: false,
            message: parsedData.error.issues[0].message,
            path: parsedData.error.issues[0].path[0] as string,
        };
    }

    try {
        await editBillRepo(billId, {
            ...parsedData.data,
            total_consumption_kwh:
                parsedData.data.day_consumption_kwh +
                parsedData.data.night_consumption_kwh,
        });
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "Failed to edit bill",
            path: "",
        };
    }
    redirect("/bills");
}

export async function getBillsDashboardData() {
    const user = await requireCurrentUser();
    const primaryAddress = await getPrimaryAddress();

    if (!primaryAddress) {
        throw new Error("Primary address not found");
    }

    const [
        billsCount,
        stats,
        priceStats,
        monthlyBillsData,
        monthlyAllBillsData,
    ] = await Promise.all([
        getAllBillsCount(user.id, primaryAddress.id),
        getBillDashboardStats(user.id, primaryAddress.id),
        getPeriodicData(user.id, primaryAddress.id),
        getMonthlyBillsData(user.id, primaryAddress.id),
        getAllMonthlyBillsData(user.id, primaryAddress.id),
    ]);

    const hasBills = billsCount > 0;

    return {
        hasBills,
        stats,
        priceStats,
        monthlyBillsData,
        monthlyAllBillsData,
    };
}

export async function getDemoDashboardData() {
    const demoAddress = await getDemoAddress();

    if (!demoAddress) {
        throw new Error("Demo address not found");
    }

    const [stats, priceStats, monthlyBillsData, monthlyAllBillsData] =
        await Promise.all([
            getDemoDashboardStats(demoAddress.id),
            getDemoPeriodicData(demoAddress.id),
            getDemoMonthlyBillsData(demoAddress.id),
            getDemoAllMonthlyBillsData(demoAddress.id),
        ]);

    return {
        stats,
        priceStats,
        monthlyBillsData,
        monthlyAllBillsData,
    };
}
