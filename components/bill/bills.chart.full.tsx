"use client";

import { Euro } from "lucide-react";

import {
    Line,
    LineChart,
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
    bill: number;
    avg: number;
}

const BillsChartFull = ({ data }: { data: ChartData[] }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
                <Euro />
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

                <Line
                    type="monotone"
                    dataKey="bill"
                    stroke="#3b47a5"
                    // fill="#3b47a5"
                    // fillOpacity={0.2}
                    strokeWidth={1}
                    dot={{ fill: "#3b47a5", r: 1.5 }}
                    activeDot={{ fill: "#3b47a5", r: 4 }}
                />

                <Line
                    type="monotone"
                    dataKey="avg"
                    stroke="#949494"
                    strokeDasharray="3 4 5 2"
                    // fill="#949494"
                    // fillOpacity={0.2}
                    strokeWidth={1}
                    dot={{ fill: "#949494", r: 1.5 }}
                    activeDot={{ fill: "#949494", r: 4 }}
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
            </LineChart>
        </ResponsiveContainer>
    );
};

export default BillsChartFull;
