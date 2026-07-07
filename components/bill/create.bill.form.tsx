"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";

import { toast } from "sonner";

import { createBill } from "@/services/bill.services";

import { AddressesProps } from "@/components/address/addresses";

const initialState = {
    success: true,
    message: "",
    path: "",
};
const CreateBillForm = ({
    primaryAddress,
    addressError,
}: {
    primaryAddress: AddressesProps | null;
    addressError: string;
}) => {
    const [state, FormAction, pending] = useActionState(
        (prevState: typeof initialState, formData: FormData) =>
            createBill(prevState, formData, primaryAddress?.id || ""),
        initialState,
    );

    useEffect(() => {
        if (addressError) {
            toast.error(addressError);
        }
        addressError = "";
    }, [addressError]);

    useEffect(() => {
        if (
            !state.success &&
            state.path !== "total" &&
            state.path !== "day_consumption_kwh" &&
            state.path !== "night_consumption_kwh"
        ) {
            toast.error(state.message);
        }
        state.success = true;
    }, [state]);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 8 + i);

    return (
        <form className="space-y-6" action={FormAction}>
            {primaryAddress ? (
                <div>
                    <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                        value={primaryAddress.address || ""}
                        disabled
                    />
                </div>
            ) : (
                <div>
                    <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                        value="Loading..."
                        disabled
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        htmlFor="month"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Month *
                    </label>
                    <select
                        id="month"
                        name="month"
                        required
                        defaultValue=""
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    >
                        <option value="" disabled>
                            Select Month
                        </option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </div>
                <div>
                    <label
                        htmlFor="year"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Year *
                    </label>
                    <select
                        id="year"
                        name="year"
                        required
                        defaultValue=""
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    >
                        <option value="" disabled>
                            Select Year
                        </option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        htmlFor="day_consumption_kwh"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Day Consumption (kWh) *
                    </label>
                    <input
                        type="number"
                        id="day_consumption_kwh"
                        name="day_consumption_kwh"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    />
                    {!state.success && state.path === "day_consumption_kwh" && (
                        <p className="text-red-500 text-xs mt-2">
                            {state.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="night_consumption_kwh"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Night Consumption (kWh) *
                    </label>
                    <input
                        type="number"
                        id="night_consumption_kwh"
                        name="night_consumption_kwh"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    />
                    {!state.success &&
                        state.path === "night_consumption_kwh" && (
                            <p className="text-red-500 text-xs mt-2">
                                {state.message}
                            </p>
                        )}
                </div>
            </div>

            <div>
                <label
                    htmlFor="total"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Bill *{" "}
                    <span className="text-red-500">&#40; in &euro; &#41;</span>
                </label>
                <input
                    type="number"
                    id="total"
                    name="total"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="Enter bill amount"
                />
                {!state.success && state.path === "total" && (
                    <p className="text-red-500 text-xs mt-2">{state.message}</p>
                )}
            </div>

            <div className="flex gap-5">
                <button
                    type="submit"
                    disabled={pending}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                    {pending ? "Adding..." : "Add Bill"}
                </button>
                <Link
                    href="/bills"
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
};

export default CreateBillForm;
