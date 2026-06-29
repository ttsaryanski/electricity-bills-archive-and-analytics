import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import { getAddresses } from "@/services/address.services";

import CreateAddressForm from "@/components/address/create.address.form";
import AddressesPage from "@/components/address/addresses";
import { AddressesProps } from "@/components/address/addresses";

const AddressPage = async () => {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/sign-in");
    }

    let addresses: AddressesProps[] = [];
    let message = "";
    try {
        const res = await getAddresses();
        addresses = res.sort((a, b) => (a.isPrimary ? -1 : 1));
    } catch (error) {
        message =
            error instanceof Error
                ? error.message
                : "Failed to fetch addresses";
    }

    return (
        <div className="address-page min-h-screen bg-gray-50 flex items-center justify-center ">
            <main className="p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Available Addresses
                            </h1>
                            <p className="text-sm text-gray-500 max-w-sm">
                                You cannot delete an address while it is the
                                primary address. Please select another address
                                as the primary address and then you will be able
                                to delete it.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Address
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <AddressesPage
                                    addresses={addresses}
                                    error={message}
                                />
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mt-2 max-w-sm">
                                <span className="text-green-600 font-semibold mr-2">
                                    *
                                </span>
                                Primary address
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <main className="p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Add Address
                            </h1>
                            <p className="text-sm text-gray-500">
                                Add a new address to your bills.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <CreateAddressForm />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddressPage;
