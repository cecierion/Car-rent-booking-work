"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { RevenueByCarData } from "@/lib/types"

interface RevenueByCarTableProps {
  data: RevenueByCarData[]
}

export function RevenueByCarTable({ data }: RevenueByCarTableProps) {
  // Sort data by revenue (highest first)
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Car</TableHead>
            <TableHead>Total Revenue</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Avg. Booking Value</TableHead>
            <TableHead>Utilization</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item) => (
            <TableRow key={item.carId}>
              <TableCell className="font-medium">{item.carName}</TableCell>
              <TableCell>${item.revenue.toLocaleString()}</TableCell>
              <TableCell>{item.bookings}</TableCell>
              <TableCell>${item.averageBookingValue.toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.utilization}%` }} />
                  </div>
                  <span className="text-xs">{item.utilization}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
