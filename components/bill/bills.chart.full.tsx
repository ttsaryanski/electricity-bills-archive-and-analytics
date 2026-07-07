"use client";

import { Euro } from "lucide-react";

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
    bills: number;
}

const BillsChartFull = ({ data }: { data: ChartData[] }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <Euro />
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
                    dataKey="bills"
                    stroke="#56a279"
                    fill="#56a279"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    dot={{ fill: "#56a279", r: 2 }}
                    activeDot={{ fill: "#56a279", r: 4 }}
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

export default BillsChartFull;
