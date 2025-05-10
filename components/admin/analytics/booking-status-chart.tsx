"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { BookingStatusData } from "@/lib/types"

interface BookingStatusChartProps {
  data: BookingStatusData[]
}

const COLORS = ["#3b82f6", "#22c55e", "#ef4444"]

export function BookingStatusChart({ data }: BookingStatusChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [value, "Bookings"]}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "6px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "none",
          }}
        />
        <Legend verticalAlign="bottom" align="center" layout="horizontal" iconType="circle" iconSize={10} />
      </PieChart>
    </ResponsiveContainer>
  )
}
