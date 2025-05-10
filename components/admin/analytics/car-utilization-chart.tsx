"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { CarUtilizationData } from "@/lib/types"

interface CarUtilizationChartProps {
  data: CarUtilizationData[]
}

export function CarUtilizationChart({ data }: CarUtilizationChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          tickLine={false}
          axisLine={false}
        />
        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={90} />
        <Tooltip
          formatter={(value) => [`${value}%`, "Utilization"]}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "6px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "none",
          }}
        />
        <Bar dataKey="utilization" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  )
}
