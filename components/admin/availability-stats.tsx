"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { Car, Booking } from "@/lib/types"
import { subMonths, differenceInMonths, isWithinInterval, parseISO, differenceInDays, max } from "date-fns"

interface AvailabilityStatsProps {
    cars: Car[]
    bookings: Booking[]
    dateRange: {
        start: Date
        end: Date
    }
}

export function AvailabilityStats({ cars, bookings, dateRange }: AvailabilityStatsProps) {
    const totalDays = Math.ceil(
        (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)
    )

    // --- Booking stats with previous period comparison ---
    const currentBookings = bookings.filter((booking) => {
        const bookingStart = parseISO(booking.startDate)
        return isWithinInterval(bookingStart, { start: dateRange.start, end: dateRange.end })
    })
    const periodLengthMonths = differenceInMonths(dateRange.end, dateRange.start) || 1
    const previousPeriodEnd = subMonths(dateRange.start, 1)
    const previousPeriodStart = subMonths(previousPeriodEnd, periodLengthMonths)
    const previousBookings = bookings.filter((booking) => {
        const bookingStart = parseISO(booking.startDate)
        return isWithinInterval(bookingStart, { start: previousPeriodStart, end: previousPeriodEnd })
    })
    const currentCount = currentBookings.length
    const previousCount = previousBookings.length
    const percentChange = previousCount === 0 ? 100 : Math.round(((currentCount - previousCount) / previousCount) * 100)

    // --- Car Utilization ---
    const carUtilizations = cars.map((car) => {
        // Get all bookings for this car in the date range
        const carBookings = bookings.filter((booking) => {
            const bookingStart = parseISO(booking.startDate)
            const bookingEnd = parseISO(booking.endDate)
            // Check if booking overlaps with date range
            return (
                booking.carId === car.id &&
                (
                    isWithinInterval(bookingStart, { start: dateRange.start, end: dateRange.end }) ||
                    isWithinInterval(bookingEnd, { start: dateRange.start, end: dateRange.end }) ||
                    (bookingStart <= dateRange.start && bookingEnd >= dateRange.end)
                )
            )
        })
        // Calculate total days the car was booked in the range
        let bookedDays = 0
        carBookings.forEach((booking) => {
            const bookingStart = parseISO(booking.startDate)
            const bookingEnd = parseISO(booking.endDate)
            // Calculate overlap with date range
            const overlapStart = bookingStart < dateRange.start ? dateRange.start : bookingStart
            const overlapEnd = bookingEnd > dateRange.end ? dateRange.end : bookingEnd
            const daysBooked = max([0, differenceInDays(overlapEnd, overlapStart) + 1])
            bookedDays += daysBooked
        })
        // Utilization percentage
        const utilization = totalDays > 0 ? (bookedDays / totalDays) * 100 : 0
        return utilization
    })
    const avgCarUtilization = carUtilizations.length > 0 ? carUtilizations.reduce((a, b) => a + b, 0) / carUtilizations.length : 0

    const stats = {
        totalCars: cars.length,
        totalBookings: bookings.length,
        totalRevenue: bookings.reduce((sum, booking) => {
            const car = cars.find((c) => c.id === booking.carId)
            if (!car) return sum
            const days = Math.ceil(
                (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )
            return sum + car.pricePerDay * days
        }, 0),
        averageOccupancy: cars.reduce((sum, car) => {
            const carBookings = bookings.filter((booking) => booking.carId === car.id)
            const bookedDays = carBookings.reduce((total, booking) => {
                const bookingStart = new Date(booking.startDate)
                const bookingEnd = new Date(booking.endDate)
                const days = Math.ceil(
                    (bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60 * 60 * 24)
                )
                return total + days
            }, 0)
            return sum + (bookedDays / totalDays) * 100
        }, 0) / cars.length,
    }

    const carTypeStats = cars.reduce((acc, car) => {
        const type = car.type || "other"
        acc[type] = (acc[type] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const locationStats = cars.reduce((acc, car) => {
        acc[car.locationId] = (acc[car.locationId] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalCars}</div>
                    <div className="text-xs text-muted-foreground">
                        {Object.entries(carTypeStats).map(([type, count]) => (
                            <div key={type} className="mt-1">
                                {type}: {count} cars
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{currentCount}</div>
                    <div className={
                        `text-xs mt-1 ${percentChange > 0 ? 'text-green-500' : percentChange < 0 ? 'text-red-500' : 'text-gray-400'}`
                    }>
                        {percentChange > 0 ? '+' : ''}{percentChange}% from previous period
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                        {Object.entries(locationStats).map(([location, count]) => (
                            <div key={location} className="mt-1">
                                {location}: {count} cars
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                        Average: ${(stats.totalRevenue / stats.totalBookings).toLocaleString()} per booking
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Occupancy</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.averageOccupancy.toFixed(1)}%</div>
                    <Progress
                        value={stats.averageOccupancy}
                        className={cn(
                            "mt-2",
                            stats.averageOccupancy > 75
                                ? "bg-green-100"
                                : stats.averageOccupancy > 25
                                    ? "bg-yellow-100"
                                    : "bg-red-100"
                        )}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Car Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgCarUtilization.toFixed(1)}%</div>
                    <Progress
                        value={avgCarUtilization}
                        className={cn(
                            "mt-2",
                            avgCarUtilization > 75
                                ? "bg-green-100"
                                : avgCarUtilization > 25
                                    ? "bg-yellow-100"
                                    : "bg-red-100"
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    )
} 