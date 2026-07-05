"use client";

import { useState, useEffect } from "react";

import { getPrimaryAddress } from "@/services/address.services";

const PrimaryAddress = () => {
    const [address, setAddress] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrimaryAddress = async () => {
            const primaryAddress = await getPrimaryAddress();
            setAddress(primaryAddress?.address || null);
        };

        fetchPrimaryAddress();
    }, []);

    return (
        <div className="primary">
            <h1 className="text-2xl font-semibold text-gray-900">
                For address
            </h1>
            <p className="text-sm text-right text-gray-500">
                {address ? address : "Loading..."}
            </p>
        </div>
    );
};

export default PrimaryAddress;
