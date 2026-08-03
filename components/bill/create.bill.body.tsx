"use client";

import { useState, useEffect } from "react";
import { getPrimaryAddress } from "@/services/address.services";

import CreateBillFileView from "@/components/bill/create.bill.file.view";
import CreateBillForm from "@/components/bill/create.bill.form";

import { AddressesProps } from "@/components/address/addresses";

const CreateBillBody = () => {
    const [file, setFile] = useState<File | null>(null);
    const [primaryAddress, setPrimaryAddress] = useState<AddressesProps | null>(
        null,
    );
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const fetchPrimaryAddress = async () => {
            try {
                const address = await getPrimaryAddress();
                setPrimaryAddress(address);
            } catch (error) {
                setMessage(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch addresses",
                );
            }
        };

        fetchPrimaryAddress();
    }, []);

    const getFile = (fileData: File | null) => {
        setFile(fileData);
    };

    return (
        <div className="max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="responsive bg-white rounded-lg border border-gray-200 p-6">
                    <CreateBillFileView file={file} />
                </div>

                <div className="responsive bg-white rounded-lg border border-gray-200 p-6">
                    <CreateBillForm
                        primaryAddress={primaryAddress}
                        addressError={message}
                        getFile={getFile}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateBillBody;
