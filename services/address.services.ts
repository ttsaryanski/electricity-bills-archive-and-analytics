"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createAddressSchema } from "@/validators/address.schema";
import {
    getAllAddresses,
    deleteAddressById,
    createAddress as createAddressRepo,
    setAddressPrimary as setAddressPrimaryRepo,
} from "@/repositories/address.repository";

import { redirect } from "next/navigation";

export async function getAddresses() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/sign-in");
    }

    try {
        const addresses = await getAllAddresses(user.id);
        return addresses;
    } catch {
        throw new Error("Failed to fetch addresses");
    }
}

export async function deleteAddress(addressId: string) {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/sign-in");
    }

    if (!addressId) {
        throw new Error("Address ID is required");
    }

    try {
        await deleteAddressById(addressId, user.id);
    } catch {
        throw new Error("Failed to delete address");
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
    const user = await getCurrentUser();
    if (!user) {
        redirect("/sign-in");
    }

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
    } catch {
        return {
            // error: "Failed to create address",
            // key: Date.now(),
            success: false,
            message: "Failed to create address",
        };
    }

    redirect("/address");
}

export async function setAddressPrimary(addressId: string) {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/sign-in");
    }

    if (!addressId) {
        throw new Error("Address ID is required");
    }

    try {
        await setAddressPrimaryRepo(addressId, user.id);
    } catch {
        throw new Error("Failed to set address as primary");
    }
    revalidatePath("/address");
}
