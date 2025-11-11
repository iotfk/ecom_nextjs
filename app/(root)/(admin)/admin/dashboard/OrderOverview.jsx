"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart"

const chartData = [
  { month: "January", amount: 186 },
  { month: "February", amount: 305 },
  { month: "March", amount: 237 },
  { month: "April", amount: 73 },
  { month: "May", amount: 209 },
  { month: "June", amount: 214 },
  { month: "July", amount: 284 },
  { month: "August", amount: 314 },
  { month: "September", amount: 294 },
  { month: "October", amount: 254 },
  { month: "November", amount: 224 },
  { month: "December", amount: 204 },



]

const chartConfig = {
  amount: {
    label: "Amount",
    color: "#7f22fe",
  },
} 

export function OrderOverview() {
  return (
  <div className=""> 
    <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent  />}
            />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={5} />
          </BarChart>
        </ChartContainer>
    </div>
  )
}
