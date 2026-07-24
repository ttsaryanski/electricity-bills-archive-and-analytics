"use client";

import { Zap } from "lucide-react";

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface ChartData {
    month: string;
    day_consumption_kwh: number;
    night_consumption_kwh: number;
}

const BillsConsumptionChartYear = ({ data }: { data: ChartData[] }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
                <Zap />
                <CartesianGrid strokeDasharray="3 3" stroke="#dddddd" />
                <XAxis
                    dataKey="month"
                    stroke="#666"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#666"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                />

                <Area
                    type="monotone"
                    dataKey="day_consumption_kwh"
                    stroke="#fc8600"
                    fill="#fc8600"
                    fillOpacity={0.2}
                    strokeWidth={1}
                    dot={{ fill: "#fc8600", r: 2 }}
                    activeDot={{ fill: "#fc8600", r: 4 }}
                />
                <Area
                    type="monotone"
                    dataKey="night_consumption_kwh"
                    stroke="#48494d"
                    fill="#48494d"
                    fillOpacity={0.2}
                    strokeWidth={1}
                    dot={{ fill: "#48494d", r: 2 }}
                    activeDot={{ fill: "#48494d", r: 4 }}
                />

                <Tooltip
                    contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{ color: "#374151", fontWeight: "500" }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default BillsConsumptionChartYear;
