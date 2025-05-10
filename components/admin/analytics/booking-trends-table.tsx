"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { BookingTrendsData } from "@/lib/types"

interface BookingTrendsTableProps {
  data: BookingTrendsData[]
}

export function BookingTrendsTable({ data }: BookingTrendsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Total Bookings</TableHead>
            <TableHead>Confirmed</TableHead>
            <TableHead>Completed</TableHead>
            <TableHead>Cancelled</TableHead>
            <TableHead>Cancellation Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.month}>
              <TableCell className="font-medium">{item.month}</TableCell>
              <TableCell>{item.totalBookings}</TableCell>
              <TableCell>{item.confirmed}</TableCell>
              <TableCell>{item.completed}</TableCell>
              <TableCell>{item.cancelled}</TableCell>
              <TableCell>
                <Badge variant={item.cancellationRate > 20 ? "destructive" : "outline"}>{item.cancellationRate}%</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
