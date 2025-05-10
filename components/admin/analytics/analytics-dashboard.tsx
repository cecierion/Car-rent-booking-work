"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Calendar, Car, DollarSign, Users } from "lucide-react"
import type { AnalyticsData } from "@/lib/types"

interface AnalyticsDashboardProps {
  data: AnalyticsData
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const { totalRevenue, totalBookings, activeBookings, averageBookingValue, revenueChange, bookingsChange } =
    data.summary

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {revenueChange >= 0 ? (
              <span className="flex items-center text-green-600">
                <ArrowUp className="mr-1 h-4 w-4" />
                {revenueChange}% from previous period
              </span>
            ) : (
              <span className="flex items-center text-red-600">
                <ArrowDown className="mr-1 h-4 w-4" />
                {Math.abs(revenueChange)}% from previous period
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBookings}</div>
          <p className="text-xs text-muted-foreground">
            {bookingsChange >= 0 ? (
              <span className="flex items-center text-green-600">
                <ArrowUp className="mr-1 h-4 w-4" />
                {bookingsChange}% from previous period
              </span>
            ) : (
              <span className="flex items-center text-red-600">
                <ArrowDown className="mr-1 h-4 w-4" />
                {Math.abs(bookingsChange)}% from previous period
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeBookings}</div>
          <p className="text-xs text-muted-foreground">
            {((activeBookings / totalBookings) * 100).toFixed(1)}% of total bookings
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Booking Value</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${averageBookingValue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Per booking</p>
        </CardContent>
      </Card>
    </div>
  )
}
