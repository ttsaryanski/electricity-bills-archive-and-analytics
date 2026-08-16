"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { trackOperation } from "@/lib/observability/track.operation";
import { requireCurrentUser } from "@/lib/auth";
import { createAddressSchema } from "@/validators/address.schema";
import {
    getAllAddresses,
    deleteAddressById,
    createAddress as createAddressRepo,
    setAddressPrimary as setAddressPrimaryRepo,
    getPrimaryAddress as getPrimaryAddressRepo,
    getDemoAddress as getDemoAddressRepo,
} from "@/repositories/address.repository";

export async function getAddresses() {
    return trackOperation(
        async () => {
            const user = await requireCurrentUser();

            try {
                const addresses = await getAllAddresses(user.id);
                return addresses;
            } catch (error) {
                console.error("Failed to fetch addresses", error);
                throw new Error("Failed to fetch addresses");
            }
        },
        { operation: "getAddresses" },
    );
}

export async function deleteAddress(addressId: string) {
    const user = await requireCurrentUser();

    if (!addressId) {
        return {
            success: false,
            message: "Address ID is required",
        };
    }

    try {
        const result = await deleteAddressById(addressId, user.id);
        if (!result.success) {
            return result;
        }
    } catch (error) {
        console.error("Failed to delete address", error);
        throw new Error("Failed to delete address");
    }

    revalidatePath("/address");
    return {
        success: true,
        message: "Address deleted successfully",
    };
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
    return trackOperation(
        async () => {
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
                const result = await createAddressRepo({
                    ...parsedData.data,
                    userId: user.id,
                });

                if (!result.success) {
                    return result;
                }
            } catch (error) {
                console.error("Failed to create address", error);
                throw new Error("Failed to create address");
            }

            redirect("/address");
        },
        { operation: "createAddress" },
    );
}

export async function setAddressPrimary(addressId: string) {
    return trackOperation(
        async () => {
            const user = await requireCurrentUser();

            if (!addressId) {
                return {
                    success: false,
                    message: "Address ID is required",
                };
            }

            try {
                const result = await setAddressPrimaryRepo(addressId, user.id);
                if (!result.success) {
                    return result;
                }
            } catch (error) {
                console.error("Failed to set address as primary", error);
                throw new Error("Failed to set address as primary");
            }

            return {
                success: true,
                message: "Address set as primary successfully",
            };
        },
        { operation: "setAddressPrimary" },
    );
}

export async function findPrimaryAddress() {
    const user = await requireCurrentUser();

    try {
        const primaryAddress = await getPrimaryAddressRepo(user.id);
        return primaryAddress ?? null;
    } catch (error) {
        console.error("Failed to fetch primary address", error);
        throw new Error("Failed to fetch primary address");
    }
}

export async function getPrimaryAddress() {
    return trackOperation(
        async () => {
            const primaryAddress = await findPrimaryAddress();

            if (!primaryAddress) {
                throw new Error("No primary address found");
            }

            return primaryAddress;
        },
        { operation: "getPrimaryAddress" },
    );
}

export async function getDemoAddress() {
    const demoAddress = await getDemoAddressRepo();

    if (!demoAddress) {
        throw new Error("Demo address not found");
    }

    return demoAddress;
}
