import PrimaryAddress from "@/components/address/primary.address";

type DashboardFallBackProps = {
    primaryAddress: string | null;
    message: string;
};

const DashboardFallBack = ({
    primaryAddress,
    message,
}: DashboardFallBackProps) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="main p-8">
                <div className="mb-8 flex items-center justify-between">
                    <div className="basis-1/2">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Dashboard
                        </h1>
                        <p className="text-sm text-gray-500">
                            Welcome back! Here is an overview of your bills.
                        </p>
                    </div>

                    <PrimaryAddress address={primaryAddress} />
                </div>

                <div className="rounded-lg border border-red-200 bg-white p-6 text-red-600">
                    {message || "No dashboard data available."}
                </div>
            </main>
        </div>
    );
};

export default DashboardFallBack;
