"use client";

import { Euro } from "lucide-react";

import {
    Bar,
    BarChart,
    LabelList,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface ChartData {
    month: string;
    bill: number;
}

const BillsChartYear = ({ data }: { data: ChartData[] }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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

                <Bar
                    dataKey="bill"
                    fill="#8b5cf6"
                    barSize={20}
                    radius={[3, 3, 0, 0]}
                >
                    <LabelList position="top" fontSize={12} />
                </Bar>

                <Tooltip
                    contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{ color: "#3c5137", fontWeight: "500" }}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BillsChartYear;
