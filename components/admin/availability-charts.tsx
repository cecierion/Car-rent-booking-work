"use client"

import { useState } from "react"
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { Car, Booking } from "@/lib/types"
import { format, eachDayOfInterval, differenceInDays } from "date-fns"

interface AvailabilityChartsProps {
    cars: Car[]
    bookings: Booking[]
    dateRange: {
        start: Date
        end: Date
    }
}

type ChartType = "bar" | "line" | "pie"
type ChartMetric = "occupancy" | "revenue" | "bookings" | "utilization"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function AvailabilityCharts({ cars, bookings, dateRange }: AvailabilityChartsProps) {
    const [chartType, setChartType] = useState<ChartType>("bar")
    const [metric, setMetric] = useState<ChartMetric>("occupancy")

    const getDailyData = () => {
        const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end })
        return days.map((date) => {
            const dayBookings = bookings.filter((booking) => {
                const bookingStart = new Date(booking.startDate)
                const bookingEnd = new Date(booking.endDate)
                return date >= bookingStart && date <= bookingEnd
            })

            const revenue = dayBookings.reduce((sum, booking) => {
                const car = cars.find((c) => c.id === booking.carId)
                return sum + (car?.pricePerDay || 0)
            }, 0)

            return {
                date: format(date, "MMM d"),
                occupancy: (dayBookings.length / cars.length) * 100,
                revenue,
                bookings: dayBookings.length,
            }
        })
    }

    const getCarTypeData = () => {
        const carTypes = cars.reduce((acc, car) => {
            const type = car.type || "other"
            if (!acc[type]) {
                acc[type] = {
                    type,
                    occupancy: 0,
                    revenue: 0,
                    bookings: 0,
                }
            }
            return acc
        }, {} as Record<string, { type: string; occupancy: number; revenue: number; bookings: number }>)

        bookings.forEach((booking) => {
            const car = cars.find((c) => c.id === booking.carId)
            if (!car) return
            const type = car.type || "other"
            const days = differenceInDays(new Date(booking.endDate), new Date(booking.startDate)) + 1
            carTypes[type].bookings++
            carTypes[type].revenue += car.pricePerDay * days
        })

        return Object.values(carTypes).map((data) => ({
            ...data,
            occupancy: (data.bookings / cars.length) * 100,
        }))
    }

    const getUtilizationData = () => {
        const totalDays = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))
        return cars.map((car) => {
            const carBookings = bookings.filter((booking) => {
                const bookingStart = new Date(booking.startDate)
                const bookingEnd = new Date(booking.endDate)
                return (
                    booking.carId === car.id &&
                    (
                        (bookingStart >= dateRange.start && bookingStart <= dateRange.end) ||
                        (bookingEnd >= dateRange.start && bookingEnd <= dateRange.end) ||
                        (bookingStart <= dateRange.start && bookingEnd >= dateRange.end)
                    )
                )
            })
            let bookedDays = 0
            carBookings.forEach((booking) => {
                const bookingStart = new Date(booking.startDate)
                const bookingEnd = new Date(booking.endDate)
                const overlapStart = bookingStart < dateRange.start ? dateRange.start : bookingStart
                const overlapEnd = bookingEnd > dateRange.end ? dateRange.end : bookingEnd
                const daysBooked = Math.max(0, Math.ceil((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24)) + 1)
                bookedDays += daysBooked
            })
            const utilization = totalDays > 0 ? (bookedDays / totalDays) * 100 : 0
            return {
                carName: `${car.make} ${car.model}`,
                utilization: Number(utilization.toFixed(1)),
            }
        })
    }

    const renderChart = () => {
        let data, xAxisDataKey, yAxisLabel
        if (metric === "utilization") {
            data = getUtilizationData()
            xAxisDataKey = "carName"
            yAxisLabel = "Utilization (%)"
        } else if (metric === "occupancy") {
            data = getDailyData()
            xAxisDataKey = "date"
            yAxisLabel = undefined
        } else {
            data = getCarTypeData()
            xAxisDataKey = "type"
            yAxisLabel = undefined
        }

        switch (chartType) {
            case "bar":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={xAxisDataKey} />
                            <YAxis label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey={metric} fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                )

            case "line":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={xAxisDataKey} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey={metric} stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                )

            case "pie":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey={metric}
                                nameKey={xAxisDataKey}
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                label
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                )
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Availability Analytics</CardTitle>
                    <div className="flex items-center space-x-4">
                        <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Chart Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bar">Bar Chart</SelectItem>
                                <SelectItem value="line">Line Chart</SelectItem>
                                <SelectItem value="pie">Pie Chart</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={metric} onValueChange={(value: ChartMetric) => setMetric(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Metric" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="occupancy">Occupancy Rate</SelectItem>
                                <SelectItem value="revenue">Revenue</SelectItem>
                                <SelectItem value="bookings">Number of Bookings</SelectItem>
                                <SelectItem value="utilization">Car Utilization</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>{renderChart()}</CardContent>
        </Card>
    )
} 