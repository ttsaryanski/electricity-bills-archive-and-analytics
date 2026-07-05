"use client";

import { useEffect } from "react";

import { toast } from "sonner";

const SearchBillForm = ({
    defaultValue,
    error,
}: {
    defaultValue?: number;
    error?: string;
}) => {
    const isYearError = error?.toLowerCase().includes("year");

    useEffect(() => {
        if (error && !isYearError) {
            toast.error(error);
        }
    }, [error]);

    return (
        <>
            <form
                className="bills search-form flex gap-2"
                action="/bills"
                method="GET"
            >
                <input
                    name="query"
                    type="number"
                    defaultValue={defaultValue}
                    placeholder="Search bills by year"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                />
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Search
                </button>
            </form>
            {isYearError && (
                <p className="text-red-500 text-xs mt-2">{error}</p>
            )}
        </>
    );
};

export default SearchBillForm;
