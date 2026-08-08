import Link from "next/link";

import { getDemoDashboardData } from "@/services/bill.services";
import { getDemoAddress } from "@/services/address.services";

import PrimaryAddress from "@/components/address/primary.address";
import BillsMetrics from "@/components/bill/bills.metrics";
import BillsChartYear from "@/components/bill/bills.chart.year";
import BillsChartFull from "@/components/bill/bills.chart.full";
import BillsConsumptionChartYear from "@/components/bill/bills.consumption.chart.year";
import BillsLevel from "@/components/bill/bills.level";
import BillsPrice from "@/components/bill/bills.price";
import AddressFallBack from "@/components/address/address.fallback";
import DashboardFallBack from "@/components/dashboard/dashboard.fallback";

const DashboardDemo = async () => {
    let address: Awaited<ReturnType<typeof getDemoAddress>> | null = null;
    try {
        address = await getDemoAddress();
    } catch (error) {
        return <AddressFallBack />;
    }

    let dashboardData: Awaited<ReturnType<typeof getDemoDashboardData>> | null =
        null;
    let message = "";

    try {
        dashboardData = await getDemoDashboardData();
    } catch (error) {
        message =
            error instanceof Error
                ? error.message
                : "Failed to fetch dashboard data";
    }

    if (!dashboardData) {
        return (
            <DashboardFallBack
                primaryAddress={address.address}
                message={message || "No dashboard data available."}
            />
        );
    }

    const { stats, priceStats, monthlyBillsData, monthlyAllBillsData } =
        dashboardData;

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="main p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="basis-1/2">
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Dashboard
                            </h1>
                            <p className="text-sm text-gray-500">
                                Welcome back! Here is an overview of your bills.
                            </p>
                        </div>

                        <PrimaryAddress address={address.address} />
                    </div>
                </div>

                <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
                    <p className="text-sm font-medium">
                        You are seeing demo data because your account does not
                        have bills yet.
                    </p>
                    <p className="mt-1 text-sm">
                        Add your first bill to replace this preview with real
                        analytics for your address.
                    </p>
                    <div className="mt-3">
                        <Link
                            href="/bills/add-bill"
                            className="inline-flex rounded-md bg-amber-900 px-3 py-2 text-sm font-medium text-white hover:bg-amber-800"
                        >
                            Add your first bill
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Key Metrics */}
                    <div className="responsive bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="mb-6">
                                Last Month Metrics ({stats.targetPeriod})
                            </h2>

                            {stats.isHasLastBill ? (
                                <h2 className="text-right mb-6">
                                    {stats.lastBill} € / {stats.lastConsumption}{" "}
                                    kWh
                                </h2>
                            ) : (
                                <h2 className="text-right mb-6 text-red-600">
                                    No bill for the {stats.targetPeriod}
                                </h2>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            <BillsMetrics stats={stats} />
                        </div>
                    </div>

                    {/* Bills over all time */}
                    <div className="responsive bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2>
                                Bills for full time{" "}
                                {monthlyAllBillsData.length === 0 ? (
                                    <span className="text-red-500">
                                        - No data available
                                    </span>
                                ) : (
                                    ""
                                )}
                            </h2>
                        </div>
                        <div className="h-48">
                            <BillsChartFull data={monthlyAllBillsData} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Consumption over year */}
                    <div className="responsive bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2>Consumption in kWh for the last 12 Months</h2>
                        </div>
                        <div className="h-48">
                            <BillsConsumptionChartYear
                                data={monthlyBillsData}
                            />
                        </div>
                    </div>

                    {/* Bills over year */}
                    <div className="responsive bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2>Bills for the last 12 Months</h2>
                        </div>
                        <div className="h-48">
                            <BillsChartYear data={monthlyBillsData} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Bills Levels */}
                    <div className="responsive bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Months with the highest / lowest consumption
                            </h2>
                        </div>
                        <div className="space-y-5">
                            <BillsLevel stats={stats} />
                        </div>
                    </div>

                    {/* Efficiency */}
                    <div className="responsive bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Price
                            </h2>
                        </div>
                        <BillsPrice stats={stats} priceStats={priceStats} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardDemo;
