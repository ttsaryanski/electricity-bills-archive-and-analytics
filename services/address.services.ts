"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/lib/auth";
import { createAddressSchema } from "@/validators/address.schema";
import {
    getAllAddresses,
    deleteAddressById,
    createAddress as createAddressRepo,
    setAddressPrimary as setAddressPrimaryRepo,
    getPrimaryAddress as getPrimaryAddressRepo,
} from "@/repositories/address.repository";

export async function getAddresses() {
    const user = await requireCurrentUser();

    try {
        const addresses = await getAllAddresses(user.id);
        return addresses;
    } catch (error) {
        throw new Error(
            error instanceof Error
                ? error.message
                : "Failed to fetch addresses",
        );
    }
}

export async function deleteAddress(addressId: string) {
    const user = await requireCurrentUser();

    if (!addressId) {
        throw new Error("Address ID is required");
    }

    try {
        await deleteAddressById(addressId, user.id);
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Failed to delete address",
        );
    }
    revalidatePath("/address");
}

type CreateAddressState = {
    // error: string | null;
    // key: number;
    success: boolean;
    message: string;
};
export async function createAddress(
    _prevState: CreateAddressState,
    formData: FormData,
) {
    const user = await requireCurrentUser();

    const parsedData = createAddressSchema.safeParse({
        address: formData.get("address"),
    });
    if (!parsedData.success) {
        return {
            // error: parsedData.error.issues[0].message,
            // key: Date.now(),
            success: false,
            message: parsedData.error.issues[0].message,
        };
    }

    try {
        await createAddressRepo({
            ...parsedData.data,
            userId: user.id,
        });
    } catch (error) {
        return {
            // error: "Failed to create address",
            // key: Date.now(),
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to create address",
        };
    }
    redirect("/address");
}

export async function setAddressPrimary(addressId: string) {
    const user = await requireCurrentUser();

    if (!addressId) {
        throw new Error("Address ID is required");
    }

    try {
        await setAddressPrimaryRepo(addressId, user.id);
    } catch (error) {
        throw new Error(
            error instanceof Error
                ? error.message
                : "Failed to set address as primary",
        );
    }
    revalidatePath("/address");
}

export async function getPrimaryAddress() {
    const user = await requireCurrentUser();

    try {
        const primaryAddress = await getPrimaryAddressRepo(user.id);
        return primaryAddress;
    } catch (error) {
        throw new Error(
            error instanceof Error
                ? error.message
                : "Failed to fetch primary address",
        );
    }
}
