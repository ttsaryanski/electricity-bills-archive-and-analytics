"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/lib/auth";

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
} from "@/repositories/bill.repository";

type CreateBillState = {
    success: boolean;
    message: string;
    path?: string;
};
export async function createBill(
    _prevState: CreateBillState,
    formData: FormData,
    addressId: string,
) {
    const user = await requireCurrentUser();

    const month = Number(formData.get("month"));
    const year = Number(formData.get("year"));
    const period = new Date(Date.UTC(year, month - 1, 1));
    const parsedData = createBillSchema.safeParse({
        month,
        year,
        period,
        total: Number(formData.get("total")),
        addressId,
    });
    if (!parsedData.success) {
        return {
            success: false,
            message: parsedData.error.issues[0].message,
            path: parsedData.error.issues[0].path[0] as string,
        };
    }

    try {
        await createBillRepo({
            ...parsedData.data,
            userId: user.id,
        });
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to create bill",
            path: "",
        };
    }
    redirect("/bills");
}

export async function getBillsPaginated(
    query: string,
    page: number,
    pageSize: number,
) {
    const user = await requireCurrentUser();

    let where = {
        userId: user.id,
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
            ...(query ? { year: queryNumber } : {}),
        };
    } else {
        where = {
            userId: user.id,
        };
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
    });
    if (!parsedData.success) {
        return {
            success: false,
            message: parsedData.error.issues[0].message,
            path: parsedData.error.issues[0].path[0] as string,
        };
    }

    try {
        await editBillRepo(billId, parsedData.data.total);
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
