import { statsProps } from "@/components/bill/bills.metrics";
import CustomActiveShapePieChart from "@/components/price/price.shart";

const BillsPrice = ({ stats }: { stats: statsProps }) => {
    return (
        <>
            <div className="flex items-baseline justify-start gap-2 mt-6 mb-3 space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-[#fc8600]" />
                        <span>Day Price ({stats.lastDayPrice} €)</span>
                    </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-[#48494d]" />
                        <span>Night Price ({stats.lastNightPrice} €)</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                <CustomActiveShapePieChart />
                {/* <div className="relative w-48 h-48">
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
                </div> */}
            </div>
        </>
    );
};

export default BillsPrice;
