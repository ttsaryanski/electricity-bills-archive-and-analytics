"use client";

import { useActionState, useEffect, useState } from "react";

import { toast } from "sonner";

import { createAddress } from "@/services/address.services";

const initialState = {
    // error: null as string | null,
    // errorKey: 0,
    success: true,
    message: "",
};

const CreateAddressForm = () => {
    const [state, FormAction, pending] = useActionState(
        createAddress,
        initialState,
    );
    const [hideError, setHideError] = useState(false);

    // useEffect(() => {
    //     if (state.error) {
    //         toast.error(state.error);
    //     }
    // }, [state.key]);

    return (
        <form
            className="space-y-6"
            action={FormAction}
            onSubmit={() => setHideError(false)}
        >
            <div>
                <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Address *
                </label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="Enter Address"
                />
                {!state.success && !hideError && (
                    <p className="text-red-500 text-xs mt-2">{state.message}</p>
                )}
            </div>

            <div className="flex gap-5">
                <button
                    type="submit"
                    disabled={pending}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                    {pending ? "Adding..." : "Add Address"}
                </button>
                <button
                    type="button"
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    onClick={() => {
                        setHideError(true);
                    }}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default CreateAddressForm;
