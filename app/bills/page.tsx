import { getBillsPaginated } from "@/services/bill.services";

import Pagination from "@/components/pagination";
import DeleteBillButton from "@/components/bill/delete.bill.button";
import EditBillButton from "@/components/bill/edit.bill.button";
import SearchBillForm from "@/components/bill/search.bill";
import PrimaryAddress from "@/components/address/primary.address";

import { Bill } from "@/interfaces/Bill";

const BillsPage = async ({
    searchParams,
}: {
    searchParams: { query?: string; page?: string };
}) => {
    const params = await searchParams;
    let query = (params.query ?? "").trim();
    const page = Math.max(1, Number(params.page ?? 1));
    const pageSize = 9;

    let bills: Bill[] = [];
    let totalCount = 0;
    let message = "";
    try {
        const { totalCount: tCount, bills: res } = await getBillsPaginated(
            query,
            page,
            pageSize,
        );
        bills = res.map((bill) => ({
            ...bill,
            total: Number(bill.total),
        }));
        totalCount = tCount;
        query = "";
    } catch (error) {
        message =
            error instanceof Error ? error.message : "Failed to fetch bills";
    }

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const billsMap = bills.map((bill) => ({
        ...bill,
        month: new Date(bill.period).toLocaleString("en-US", {
            month: "long",
            timeZone: "UTC",
        }),
    }));

    return (
        <div className="bills min-h-screen bg-gray-50">
            <main className="p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Bills
                            </h1>
                            <p className="text-sm text-gray-500">
                                Manage your bills and track payment statuses.
                            </p>
                        </div>
                        <PrimaryAddress />
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Search */}
                    <div className="form-div bg-white rounded-lg border border-gray-200 p-6">
                        <SearchBillForm
                            defaultValue={query ? Number(query) : undefined}
                            error={message}
                        />
                    </div>

                    {/* Bills Table */}
                    <div className="bills bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Month
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Year
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Bill
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {billsMap.map((bill, key) => (
                                    <tr key={key} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {bill.month}
                                        </td>
                                        <td className="px-6 py-4  text-sm text-gray-500">
                                            {bill.year}
                                        </td>
                                        <td className="px-6 py-4  text-sm text-gray-900">
                                            € {bill.total.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4  text-sm text-gray-500">
                                            <EditBillButton id={bill.id} />
                                            <DeleteBillButton id={bill.id} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                baseUrl="/bills"
                                searchParams={{
                                    query,
                                    pageSize: String(pageSize),
                                }}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default BillsPage;
