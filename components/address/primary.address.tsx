"use client";

import { useEffect } from "react";

import { MoveRight } from "lucide-react";

import { toast } from "sonner";

type PrimaryAddressProps = {
    address: string | null;
    error?: string;
};

const PrimaryAddress = ({ address, error }: PrimaryAddressProps) => {
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return (
        <div className="primary basis-1/2">
            <h1 className="text-2xl text-right font-semibold text-gray-900">
                Selected address
            </h1>
            <h2 className="text-1xl text-right font-semibold text-gray-500">
                {address ? (
                    <>
                        <MoveRight className="inline-block mr-2" />
                        {address}
                    </>
                ) : (
                    "Loading..."
                )}
            </h2>
            <p className="text-sm text-right text-gray-500">
                From the Addresses page, you can change your primary address.
            </p>
        </div>
    );
};

export default PrimaryAddress;
