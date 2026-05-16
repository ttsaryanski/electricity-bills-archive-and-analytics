import { TrendingUp } from "lucide-react";

import { getDashboardData } from "@/services/product.services";

import { ProductsChart } from "@/components/products.charts";

const Dashboard = async () => {
    const { stats, weeklyProductsData } = await getDashboardData();

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Dashboard
                            </h1>
                            <p className="text-sm text-gray-500">
                                Welcome back! Here is an overview of your
                                inventory.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Key Metrics */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            Key Metrics
                        </h2>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    {stats.productsCount}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total Products
                                </div>
                                <div className="flex items-center justify-center mt-1">
                                    <span className="text-xs text-green-600">
                                        +{stats.productsCount}
                                    </span>
                                    <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    ${Number(stats.totalValue).toFixed(0)}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total Value
                                </div>
                                <div className="flex items-center justify-center mt-1">
                                    <span className="text-xs text-green-600">
                                        +${Number(stats.totalValue).toFixed(0)}
                                    </span>
                                    <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    {stats.lowStock}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Low Stock
                                </div>
                                <div className="flex items-center justify-center mt-1">
                                    <span className="text-xs text-green-600">
                                        +{stats.lowStock}
                                    </span>
                                    <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Iventory over time */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2>New products per week</h2>
                        </div>
                        <div className="h-48">
                            <ProductsChart data={weeklyProductsData} />
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
                            {stats.recentProducts.map((product, key) => {
                                const stockLevel =
                                    product.quantity === 0
                                        ? 0
                                        : product.quantity <=
                                            (product.lowStockAt || 5)
                                          ? 1
                                          : 2;

                                const bgColors = [
                                    "bg-red-600",
                                    "bg-yellow-600",
                                    "bg-green-600",
                                ];
                                const textColors = [
                                    "text-red-600",
                                    "text-yellow-600",
                                    "text-green-600",
                                ];
                                return (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`w-3 h-3 rounded-full ${bgColors[stockLevel]}`}
                                            />
                                            <span className="text-sm font-medium text-gray-900">
                                                {product.name}
                                            </span>
                                        </div>
                                        <div
                                            className={`text-sm font-medium ${textColors[stockLevel]}`}
                                        >
                                            {product.quantity} units
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Efficiency */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Efficiency
                            </h2>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="relative w-48 h-48">
                                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                                <div
                                    className="absolute inset-0 rounded-full border-8 border-purple-600"
                                    style={{
                                        clipPath:
                                            "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)",
                                    }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {stats.inStockPercentage}%
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            In Stock
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-200" />
                                    <span>
                                        In Stock ({stats.inStockPercentage}%)
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-600" />
                                    <span>
                                        Low Stock ({stats.lowStockPercentage}%)
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                                    <span>
                                        Out of Stock (
                                        {stats.outOfStockPercentage}%)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
