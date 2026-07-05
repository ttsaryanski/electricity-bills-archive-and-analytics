import { getBillById } from "@/services/bill.services";

import EditBillForm from "@/components/bill/edit.bill.form";

import { BillProps } from "@/components/bill/edit.bill.form";

type Props = {
    params: Promise<{ id: string }>;
};
const EditBillPage = async ({ params }: Props) => {
    const { id } = await params;

    let bill: BillProps | null = null;
    let message = "";
    try {
        bill = await getBillById(id);
    } catch (error) {
        message =
            error instanceof Error ? error.message : "Failed to fetch bill";
    }
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <main className="p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Edit Bill
                            </h1>
                            <p className="text-sm text-gray-500">
                                Edit the details of your bill
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <EditBillForm bill={bill} getBillError={message} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditBillPage;
