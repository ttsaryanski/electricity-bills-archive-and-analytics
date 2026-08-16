"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import DeleteAddressButton from "@/components/address/delete.address.button";
import SetAddressPrimaryButton from "@/components/address/set.address.primary.button";

export type AddressesProps = {
    id: string;
    isPrimary: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    address: string;
};
const AddressesPage = ({
    addresses,
    error,
}: {
    addresses: AddressesProps[];
    error: string;
}) => {
    const [rows, setRows] = useState(addresses);
    const [prevAddresses, setPrevAddresses] = useState(addresses);
    const singleAddress = rows.length === 1;

    if (addresses !== prevAddresses) {
        setPrevAddresses(addresses);
        setRows(addresses);
    }

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handlePrimaryChanged = (addressId: string) => {
        setRows((current) =>
            current.map((address) => ({
                ...address,
                isPrimary: address.id === addressId,
            })),
        );
    };

    return (
        <>
            {rows.map((address) => (
                <tr key={address.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {address.address}
                        {address.isPrimary && (
                            <span className="ml-1 text-green-600  font-semibold">
                                *
                            </span>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <SetAddressPrimaryButton
                            id={address.id}
                            isPrimary={address.isPrimary}
                            onSuccess={() => handlePrimaryChanged(address.id)}
                        />
                        <DeleteAddressButton
                            id={address.id}
                            isPrimary={address.isPrimary}
                            isSingleAddress={singleAddress}
                        />
                    </td>
                </tr>
            ))}
        </>
    );
};

export default AddressesPage;
