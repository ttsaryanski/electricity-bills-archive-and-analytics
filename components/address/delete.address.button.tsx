"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { deleteAddress } from "@/services/address.services";

const DeleteAddressButton = ({
    id,
    isPrimary,
    isSingleAddress,
}: {
    id: string;
    isPrimary: boolean;
    isSingleAddress: boolean;
}) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        const confirmed = confirm("Delete this address?");
        if (!confirmed) return;

        startTransition(() => {
            void (async () => {
                try {
                    await deleteAddress(id);
                    router.refresh();
                } catch (error) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to delete address",
                    );
                }
            })();
        });
    };

    return (
        <button
            className={`${isPrimary && !isSingleAddress ? "text-gray-500 cursor-not-allowed" : "text-red-600 hover:text-red-900 hover:cursor-pointer"}`}
            onClick={handleDelete}
            disabled={isPending || (isPrimary && !isSingleAddress)}
        >
            {isPending ? "Deleting..." : "Delete"}
        </button>
    );
};

export default DeleteAddressButton;
