"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { setAddressPrimary } from "@/services/address.services";

type SetAddressPrimaryButtonProps = {
    id: string;
    isPrimary: boolean;
};

const SetAddressPrimaryButton = ({
    id,
    isPrimary,
}: SetAddressPrimaryButtonProps) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSetPrimary = () => {
        const confirmed = confirm("Set this address as primary?");
        if (!confirmed) return;

        startTransition(() => {
            void (async () => {
                try {
                    await setAddressPrimary(id);
                    router.refresh();
                } catch (error) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to set address as primary",
                    );
                }
            })();
        });
    };

    return (
        <button
            className={`${isPrimary ? "text-gray-500 cursor-not-allowed" : "text-green-600 hover:text-green-900 hover:cursor-pointer"} mr-2`}
            onClick={handleSetPrimary}
            disabled={isPending || isPrimary}
        >
            {isPending ? "Setting..." : "Set Primary"}
        </button>
    );
};

export default SetAddressPrimaryButton;
