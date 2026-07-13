"use client";

import {
    Pie,
    PieChart,
    PieLabelRenderProps,
    PieSectorShapeProps,
    Sector,
    useActiveTooltipDataPoints,
    useIsTooltipActive,
    Tooltip,
} from "recharts";

// #region Sample data
const data1 = [
    { period: 1, name: "Price", value: 12, fill: "#0088FE" },
    { period: 1, name: "Consumption", value: 34, fill: "#00C49F" },
    { period: 1, name: "Bill", value: 54, fill: "#FFBB28" },
];
const data2 = [
    { period: 2, name: "Price", value: 5, fill: "#0088FE" },
    { period: 2, name: "Consumption", value: 40, fill: "#00C49F" },
    { period: 2, name: "Bill", value: 80, fill: "#FFBB28" },
];
const data3 = [
    { period: 3, name: "Price", value: 25, fill: "#0088FE" },
    { period: 3, name: "Consumption", value: 30, fill: "#00C49F" },
    { period: 3, name: "Bill", value: 70, fill: "#FFBB28" },
];

// #endregion
const RADIAN = Math.PI / 180;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
}: PieLabelRenderProps) => {
    if (
        cx == null ||
        cy == null ||
        innerRadius == null ||
        outerRadius == null
    ) {
        return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const ncx = Number(cx);
    const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const ncy = Number(cy);
    const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > ncx ? "start" : "end"}
            dominantBaseline="central"
        >
            {`${(value ?? 1).toFixed(0)}%`}
        </text>
    );
};

const MyCustomPie = (props: PieSectorShapeProps) => {
    const p = useActiveTooltipDataPoints();
    const isAnyPieActive = useIsTooltipActive();
    const isThisPieActive = isAnyPieActive && props.payload === p?.[0];
    let fillOpacity: number;
    if (isAnyPieActive && !isThisPieActive) {
        fillOpacity = 0.5;
    } else {
        fillOpacity = 1;
    }
    return (
        <Sector
            {...props}
            fill={COLORS[props.index % COLORS.length]}
            fillOpacity={fillOpacity}
            style={{ transition: "fill-opacity 0.3s ease" }}
        />
    );
};

export default function CustomActiveShapePieChart({
    isAnimationActive = true,
}: {
    isAnimationActive?: boolean;
}) {
    const MyPie1 = () => (
        <Pie
            data={data1}
            labelLine={false}
            label={renderCustomizedLabel}
            dataKey="value"
            isAnimationActive={isAnimationActive}
            shape={MyCustomPie}
        />
    );
    const MyPie2 = () => (
        <Pie
            data={data2}
            labelLine={false}
            label={renderCustomizedLabel}
            dataKey="value"
            isAnimationActive={isAnimationActive}
            shape={MyCustomPie}
        />
    );
    const MyPie3 = () => (
        <Pie
            data={data3}
            labelLine={false}
            label={renderCustomizedLabel}
            dataKey="value"
            isAnimationActive={isAnimationActive}
            shape={MyCustomPie}
        />
    );
    return (
        <>
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-around",
                    alignItems: "stretch",
                }}
            >
                <p>{data1[0].period}</p>
                <p>{data2[0].period}</p>
                <p>{data3[0].period}</p>
            </div>
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    border: "1px solid #ccc",
                    padding: "10px",
                    justifyContent: "space-around",
                    alignItems: "stretch",
                }}
            >
                <PieChart
                    responsive
                    style={{
                        height: "calc(100% - 20px)",
                        width: "60%",
                        flex: "1 1 300px",
                        aspectRatio: 1,
                    }}
                >
                    <MyPie1 />
                    <Tooltip />
                </PieChart>

                <PieChart
                    responsive
                    style={{
                        height: "calc(100% - 20px)",
                        width: "60%",
                        flex: "1 1 300px",
                        aspectRatio: 1,
                    }}
                >
                    <MyPie2 />
                    <Tooltip />
                </PieChart>

                <PieChart
                    responsive
                    style={{
                        height: "calc(100% - 20px)",
                        width: "60%",
                        flex: "1 1 300px",
                        aspectRatio: 1,
                    }}
                >
                    <MyPie3 />
                    <Tooltip />
                </PieChart>
            </div>
        </>
    );
}
