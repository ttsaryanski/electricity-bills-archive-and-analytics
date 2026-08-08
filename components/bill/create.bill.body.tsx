"use client";

import { useState } from "react";

import CreateBillFileView from "@/components/bill/create.bill.file.view";
import CreateBillForm from "@/components/bill/create.bill.form";

import { AddressesProps } from "@/components/address/addresses";

type CreateBillBodyProps = {
    primaryAddress: AddressesProps | null;
};

const CreateBillBody = ({ primaryAddress }: CreateBillBodyProps) => {
    const [file, setFile] = useState<File | null>(null);

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
                        getFile={getFile}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateBillBody;
