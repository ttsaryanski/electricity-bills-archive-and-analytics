import CreateBillBody from "@/components/bill/create.bill.body";

const AddBillPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <main className="p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="basis-1/1 text-center">
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Add Bill
                            </h1>
                            <p className="text-sm text-gray-500">
                                Add a new bill to your records
                            </p>
                        </div>
                    </div>
                </div>

                <CreateBillBody />
            </main>
        </div>
    );
};

export default AddBillPage;
