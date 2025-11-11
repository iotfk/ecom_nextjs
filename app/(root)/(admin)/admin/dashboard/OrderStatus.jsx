"use client"

import { Label, Pie, PieChart } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A donut chart"

const chartData = [
    { status: "pending", count: 275, fill: "var(--color-pending)" },
    { status: "processing", count: 200, fill: "var(--color-processing)" },
    { status: "shipped", count: 187, fill: "var(--color-shipped)" },
    { status: "delivered", count: 173, fill: "var(--color-delivered)" },
    { status: "cancelled", count: 90, fill: "var(--color-cancelled)" },
    { status: "unverified", count: 90, fill: "var(--color-unverified)" },
]

const chartConfig = {
    status: {
        label: "Status",
    },
    pending: {
        label: "Pending",
        color: "#3b82f6",
    },
    processing: {
        label: "Processing",
        color: "#06b6d4",
    },
    shipped: {
        label: "Shipped",
        color: "#f59e0b",
    },
    delivered: {
        label: "Delivered",
        color: "#16a34a",
    },
    cancelled: {
        label: "Cancelled",
        color: "#ef4444",
    },
    unverified: {
        label: "Unverified",
        color: "#9333ea",
    },
}

export function OrderStatus() {
    return (
        <div>
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
            >
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                    />
                    <Pie
                        data={chartData}
                        dataKey="count"
                        nameKey="status"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                    >


                        
                        <Label
                            content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-3xl font-bold"
                                            >
                                                98
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                            >
                                                Orders
                                            </tspan>
                                        </text>
                                    )
                                }
                                return null;
                            }}
                        />




                    </Pie>
                </PieChart>
            </ChartContainer>
<div className="">
   <ul>
    <li className="flex justify-between items-center mb-3 text-sm"> <span>Pending</span> <span className="text-white bg-blue-500 font-semibold rounded-full px-2 text-sm">275</span></li>
    <li className="flex justify-between items-center mb-3 text-sm"> <span>Processing</span> <span className="text-white bg-blue-400 font-semibold rounded-full px-2 text-sm">200</span></li>
    <li className="flex justify-between items-center mb-3 text-sm"> <span>Shipped</span> <span className="text-white bg-yellow-500 font-semibold rounded-full px-2 text-sm">187</span></li>
    <li className="flex justify-between items-center mb-3 text-sm"> <span>Delivered</span> <span className="text-white bg-green-500 font-semibold rounded-full px-2 text-sm">173</span></li>
    <li className="flex justify-between items-center mb-3 text-sm"> <span>Cancelled</span> <span className="text-white bg-red-500 font-semibold rounded-full px-2 text-sm">90</span></li>
    <li className="flex justify-between items-center mb-3 text-sm"> <span>Unverified</span> <span className="text-white bg-violet-500 font-semibold rounded-full px-2 text-sm">90</span></li>
   </ul>
</div>
        </div>
    )
}
