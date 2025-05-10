"use client"

import { useState, useEffect } from "react"
import { format, eachDayOfInterval, isWithinInterval, isSameDay, differenceInDays } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Booking } from "@/lib/types"

interface AvailabilityTimelineProps {
    bookings: Booking[]
    startDate: Date
    endDate: Date
    className?: string
}

export function AvailabilityTimeline({ bookings, startDate, endDate, className }: AvailabilityTimelineProps) {
    const [days, setDays] = useState<Date[]>([])
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

    useEffect(() => {
        // Generate array of dates between start and end date
        const dateRange = eachDayOfInterval({ start: startDate, end: endDate })
        setDays(dateRange)
    }, [startDate, endDate])

    const getBookingsForDate = (date: Date) => {
        return bookings.filter((booking) => {
            const bookingStart = new Date(booking.startDate)
            const bookingEnd = new Date(booking.endDate)
            return isWithinInterval(date, { start: bookingStart, end: bookingEnd })
        })
    }

    const isDateBooked = (date: Date) => {
        return getBookingsForDate(date).length > 0
    }

    const isDateStart = (date: Date) => {
        return bookings.some((booking) => isSameDay(new Date(booking.startDate), date))
    }

    const isDateEnd = (date: Date) => {
        return bookings.some((booking) => isSameDay(new Date(booking.endDate), date))
    }

    const getBookingTooltip = (date: Date) => {
        const dateBookings = getBookingsForDate(date)
        if (dateBookings.length === 0) return null

        return (
            <div className="space-y-2">
                <div className="font-medium">Bookings on {format(date, "MMM d, yyyy")}:</div>
                {dateBookings.map((booking) => {
                    const start = new Date(booking.startDate)
                    const end = new Date(booking.endDate)
                    const duration = differenceInDays(end, start) + 1

                    return (
                        <div key={booking.id} className="text-sm">
                            <div className="font-medium">{booking.name}</div>
                            <div className="text-muted-foreground">
                                {format(start, "MMM d")} - {format(end, "MMM d")} ({duration} days)
                            </div>
                            <div className="text-muted-foreground">Status: {booking.status}</div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <TooltipProvider>
            <div className={cn("flex items-center space-x-1", className)}>
                {days.map((date, index) => {
                    const booked = isDateBooked(date)
                    const isStart = isDateStart(date)
                    const isEnd = isDateEnd(date)
                    const tooltipContent = getBookingTooltip(date)

                    return (
                        <Tooltip key={date.toISOString()}>
                            <TooltipTrigger asChild>
                                <div
                                    className={cn(
                                        "h-8 w-8 rounded-sm flex items-center justify-center text-xs font-medium cursor-pointer transition-colors",
                                        booked
                                            ? "bg-red-500 hover:bg-red-600 text-white"
                                            : "bg-green-500 hover:bg-green-600 text-white",
                                        isStart && "rounded-l-md",
                                        isEnd && "rounded-r-md",
                                        index === 0 && "rounded-l-md",
                                        index === days.length - 1 && "rounded-r-md"
                                    )}
                                    onMouseEnter={() => setHoveredDate(date)}
                                    onMouseLeave={() => setHoveredDate(null)}
                                >
                                    {format(date, "d")}
                                </div>
                            </TooltipTrigger>
                            {tooltipContent && (
                                <TooltipContent side="top" className="w-64">
                                    {tooltipContent}
                                </TooltipContent>
                            )}
                        </Tooltip>
                    )
                })}
            </div>
        </TooltipProvider>
    )
} 