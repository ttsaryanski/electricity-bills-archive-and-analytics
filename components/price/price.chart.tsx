"use client";

import {
    Bar,
    BarChart,
    LabelList,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
    YAxisTickContentProps,
    Text,
} from "recharts";

const CustomYAxisTick = (props: YAxisTickContentProps) => {
    const {
        payload: { value },
    } = props;

    let fill: string;
    switch (Math.sign(value)) {
        case -1:
            fill = "red";
            break;
        case 1:
            fill = "green";
            break;
        default:
            fill = "black";
    }

    return (
        <Text
            {...props}
            fill={fill}
            fontWeight={value === 0 ? "bold" : "normal"}
        >
            {value}
        </Text>
    );
};

interface ChartData {
    label: string;
    priceChangePct: number | null;
    consumptionChangePct: number | null;
    billChangePct: number | null;
}

const PriceChart = ({ data }: { data: ChartData[] }) => {
    return (
        <BarChart
            data={data}
            style={{
                width: "100%",
                maxWidth: "700px",
                maxHeight: "70vh",
                aspectRatio: 1.618,
            }}
            margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" stroke="#dddddd" />
            <XAxis
                dataKey="label"
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
                width="auto"
                tick={CustomYAxisTick}
            />

            <Bar
                dataKey="priceChangePct"
                fill="#cb384e"
                fillOpacity={0.8}
                barSize={35}
                radius={[3, 3, 0, 0]}
            >
                <LabelList position="top" fontSize={12} />
            </Bar>

            <Bar
                dataKey="consumptionChangePct"
                fill="#384ec6"
                fillOpacity={0.8}
                barSize={35}
                radius={[3, 3, 0, 0]}
            >
                <LabelList position="top" fontSize={12} />
            </Bar>

            <Bar
                dataKey="billChangePct"
                fill="#4bbc37"
                fillOpacity={0.8}
                barSize={35}
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
                labelStyle={{ color: "#3c5137", fontWeight: "400" }}
            />
        </BarChart>
    );
};

export default PriceChart;
