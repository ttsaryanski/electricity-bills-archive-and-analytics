import { getDashboardData } from "@/services/product.services";
import { getBillsDashboardData } from "@/services/bill.services";

import PrimaryAddress from "@/components/address/primary.address";
import BillsMetrics from "@/components/bill/bills.metrics";
import BillsChartYear from "@/components/bill/bills.chart.year";
import BillsChartFull from "@/components/bill/bills.chart.full";
import BillsConsumptionChartYear from "@/components/bill/bills.consumption.chart.year";
import BillsLevel from "@/components/bill/bills.level";
import BillsEfficiency from "@/components/bill/bills.efficiency";

const Dashboard = async () => {
    const { stats, weeklyProductsData } = await getDashboardData();
    const { monthlyBillsData, monthlyAllBillsData } =
        await getBillsDashboardData();

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="p-8">
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

                        <PrimaryAddress />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Key Metrics */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            Key Metrics
                        </h2>
                        <div className="grid grid-cols-3 gap-6">
                            {/* <BillsMetrics stats={stats} /> */}
                        </div>
                    </div>

                    {/* Bills over all time */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2>Bills for full time</h2>
                        </div>
                        <div className="h-48">
                            <BillsChartFull data={monthlyAllBillsData} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Consumption over year */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
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
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2>Bills for the last 12 Months</h2>
                        </div>
                        <div className="h-48">
                            <BillsChartYear data={monthlyBillsData} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Stock Levels */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Stock Levels
                            </h2>
                        </div>
                        <div className="space-y-3">
                            <BillsLevel stats={stats} />
                        </div>
                    </div>

                    {/* Efficiency */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Efficiency
                            </h2>
                        </div>
                        <BillsEfficiency stats={stats} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
