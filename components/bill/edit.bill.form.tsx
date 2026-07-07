"use client";

import { useEffect, useActionState } from "react";
import Link from "next/link";

import { toast } from "sonner";

import { editBill } from "@/services/bill.services";

const initialState = {
    success: true,
    message: "",
    path: "",
};
export type BillProps = {
    id: string;
    month: number;
    year: number;
    total: number;
    period: Date;
    day_consumption_kwh: number;
    night_consumption_kwh: number;
    address: {
        address: string;
    };
};
const EditBillForm = ({
    bill,
    getBillError,
}: {
    bill: BillProps | null;
    getBillError: string;
}) => {
    const [state, FormAction, pending] = useActionState(
        (prevState: typeof initialState, formData: FormData) =>
            editBill(prevState, formData, bill?.id || ""),
        initialState,
    );

    useEffect(() => {
        if (getBillError) {
            toast.error(getBillError);
        }
    }, [getBillError]);

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

    return (
        <form className="space-y-6" action={FormAction}>
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
                    value={bill?.address?.address || ""}
                    disabled
                />
            </div>

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
                        disabled
                        required
                        defaultValue={bill?.month || ""}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    >
                        <option value={bill?.month} disabled>
                            {bill?.month
                                ? new Date(bill.period).toLocaleString(
                                      "en-US",
                                      {
                                          month: "long",
                                          timeZone: "UTC",
                                      },
                                  )
                                : "Select Month"}
                        </option>
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
                        disabled
                        required
                        defaultValue={bill?.year || ""}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    >
                        <option value={bill?.year} disabled>
                            {bill?.year || "Select Year"}
                        </option>
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
                        defaultValue={bill?.day_consumption_kwh || ""}
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
                        defaultValue={bill?.night_consumption_kwh || ""}
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
                    defaultValue={bill?.total || ""}
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
                    {pending ? "Updating..." : "Update Bill"}
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

export default EditBillForm;
