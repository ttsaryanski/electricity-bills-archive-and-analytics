import { TrendingUp, TrendingDown } from "lucide-react";

import { BillWithAddressAndConsumption } from "@/interfaces/Bill";

export type statsProps = {
    billsForLastMonthCount: number;
    isUp: boolean;
    isConsUp: boolean;
    isAvgUp: boolean;
    growthPercentage: number | null;
    growthConsumptionPercentage: number | null;
    avgBillPercentage: number | null;
    avgTotalBill: number | null;
    avgTotalConsumpion: number | null;
    isConsumptionUp: boolean;
    avgConsumptionPercentage: number | null;
    isPriceUp: boolean;
    lastDayPrice: number | null;
    lastNightPrice: number | null;
    lastBillDayPrice: number | null;
    lastBillNightPrice: number | null;
    isLastPriceLastBillPrice: boolean;
    lastPriceStart: Date | null;
    slicedBills: BillWithAddressAndConsumption[];
};
const BillsMetrics = ({ stats }: { stats: statsProps }) => {
    return (
        <>
            <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                    {stats.billsForLastMonthCount}
                </div>
                <div className="text-sm text-gray-600">
                    Bills for the same period
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                        <span className="text-xs text-gray-600 mr-1">Bill</span>
                        {stats.isUp ? (
                            <span className="text-xs text-red-600">
                                {stats.growthPercentage !== null
                                    ? `${stats.growthPercentage.toFixed(2)}%`
                                    : ""}
                            </span>
                        ) : (
                            <span className="text-xs text-green-600">
                                {stats.growthPercentage !== null
                                    ? `${stats.growthPercentage.toFixed(2)}%`
                                    : ""}
                            </span>
                        )}
                        {stats.growthPercentage !== null ? (
                            <>
                                {" "}
                                {stats.isUp ? (
                                    <TrendingUp className="w-3 h-3 text-red-600 ml-1" />
                                ) : (
                                    <TrendingDown className="w-3 h-3 text-green-600 ml-1" />
                                )}
                            </>
                        ) : null}
                    </div>

                    <div className="flex items-center justify-center">
                        <span className="text-xs text-gray-600 mr-1">
                            Consumption
                        </span>
                        {stats.isConsUp ? (
                            <span className="text-xs text-red-600">
                                {stats.growthConsumptionPercentage !== null
                                    ? `${stats.growthConsumptionPercentage.toFixed(2)}%`
                                    : ""}
                            </span>
                        ) : (
                            <span className="text-xs text-green-600">
                                {stats.growthConsumptionPercentage !== null
                                    ? `${stats.growthConsumptionPercentage.toFixed(2)}%`
                                    : ""}
                            </span>
                        )}
                        {stats.growthConsumptionPercentage !== null ? (
                            <>
                                {" "}
                                {stats.isConsUp ? (
                                    <TrendingUp className="w-3 h-3 text-red-600 ml-1" />
                                ) : (
                                    <TrendingDown className="w-3 h-3 text-green-600 ml-1" />
                                )}
                            </>
                        ) : null}
                    </div>
                </div>
                {stats.growthPercentage !== null ? (
                    <div className="text-sm text-gray-600">
                        Compared to the previous year
                    </div>
                ) : null}
            </div>

            <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                    {Number(stats.avgTotalBill).toFixed(0)} €
                </div>
                <div className="text-sm text-gray-600">
                    AVG for the same period
                </div>

                {stats.avgBillPercentage !== 0 &&
                stats.avgBillPercentage !== null ? (
                    <>
                        <div className="flex items-center justify-center mt-1">
                            {stats.isAvgUp ? (
                                <span className="text-xs text-red-600">
                                    {stats.avgBillPercentage !== null
                                        ? `${stats.avgBillPercentage.toFixed(2)}%`
                                        : ""}
                                </span>
                            ) : (
                                <span className="text-xs text-green-600">
                                    {stats.avgBillPercentage !== null
                                        ? `${stats.avgBillPercentage.toFixed(2)}%`
                                        : ""}
                                </span>
                            )}
                            {stats.avgBillPercentage !== 0 ? (
                                <>
                                    {" "}
                                    {stats.isAvgUp ? (
                                        <TrendingUp className="w-3 h-3 text-red-600 ml-1" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3 text-green-600 ml-1" />
                                    )}
                                </>
                            ) : null}
                        </div>
                        <div className="text-sm text-gray-600">
                            Compared to the avg
                        </div>
                    </>
                ) : null}
            </div>

            <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                    {Number(stats.avgTotalConsumpion).toFixed(0)}{" "}
                    <span className="text-sm">kWh</span>
                </div>
                <div className="text-sm text-gray-600">AVG consumption</div>
                {stats.avgConsumptionPercentage !== 0 &&
                stats.avgConsumptionPercentage !== null ? (
                    <>
                        <div className="flex items-center justify-center mt-1">
                            {stats.isConsumptionUp ? (
                                <span className="text-xs text-red-600">
                                    {stats.avgConsumptionPercentage !== null
                                        ? `${stats.avgConsumptionPercentage.toFixed(2)}%`
                                        : ""}
                                </span>
                            ) : (
                                <span className="text-xs text-green-600">
                                    {stats.avgConsumptionPercentage !== null
                                        ? `${stats.avgConsumptionPercentage.toFixed(2)}%`
                                        : ""}
                                </span>
                            )}
                            {stats.avgConsumptionPercentage !== 0 ? (
                                <>
                                    {" "}
                                    {stats.isConsumptionUp ? (
                                        <TrendingUp className="w-3 h-3 text-red-600 ml-1" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3 text-green-600 ml-1" />
                                    )}
                                </>
                            ) : null}
                        </div>
                        <div className="text-sm text-gray-600">
                            Compared to the avg
                        </div>
                    </>
                ) : null}
            </div>
        </>
    );
};

export default BillsMetrics;
