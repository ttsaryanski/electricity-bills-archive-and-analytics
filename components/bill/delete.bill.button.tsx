"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { deleteBill } from "@/services/bill.services";

const DeleteButton = ({ id }: { id: string }) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        const confirmed = confirm("Delete this bill?");
        if (!confirmed) return;

        startTransition(() => {
            void (async () => {
                try {
                    await deleteBill(id);
                    router.refresh();
                } catch (error) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to delete bill",
                    );
                }
            })();
        });
    };

    return (
        <button
            type="button"
            className="text-red-600 hover:text-red-900 hover:cursor-pointer"
            onClick={handleDelete}
            disabled={isPending}
        >
            {isPending ? "Deleting..." : "Delete"}
        </button>
    );
};

export default DeleteButton;
