"use client"

import { useState } from "react"
import { format, differenceInDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AvailabilityTimeline } from "./availability-timeline"
import { useRouter } from "next/navigation"
import type { Car, Booking } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CarAvailabilityCardProps {
  car: Car
  bookings: Booking[]
}

export function CarAvailabilityCard({ car, bookings }: CarAvailabilityCardProps) {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedRange, setSelectedRange] = useState<{
    from: Date
    to: Date
  }>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  })

  const isCarAvailable = (startDate: Date, endDate: Date) => {
    return !bookings.some((booking) => {
      const bookingStart = new Date(booking.startDate)
      const bookingEnd = new Date(booking.endDate)
      return (
        (startDate >= bookingStart && startDate <= bookingEnd) ||
        (endDate >= bookingStart && endDate <= bookingEnd) ||
        (startDate <= bookingStart && endDate >= bookingEnd)
      )
    })
  }

  const calculateTotalPrice = () => {
    const days = differenceInDays(selectedRange.to, selectedRange.from) + 1
    return days * car.pricePerDay
  }

  const handleBookNow = () => {
    const searchParams = new URLSearchParams({
      startDate: selectedRange.from.toISOString(),
      endDate: selectedRange.to.toISOString(),
    })
    router.push(`/book/${car.id}?${searchParams.toString()}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {car.make} {car.model} ({car.year})
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            ${car.pricePerDay}/day
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Availability Timeline</h3>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="h-3 w-3 rounded-sm bg-green-500" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="h-3 w-3 rounded-sm bg-red-500" />
                    <span>Booked</span>
                  </div>
                </div>
              </div>
              <AvailabilityTimeline
                bookings={bookings}
                startDate={selectedRange.from}
                endDate={selectedRange.to}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Select Date Range</h3>
              <Calendar
                mode="range"
                selected={selectedRange}
                onSelect={(range: any) => {
                  if (range?.from && range?.to) {
                    setSelectedRange(range)
                  }
                }}
                numberOfMonths={2}
                className="rounded-md border"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Car Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Transmission:</span>
                  <span className="ml-2 font-medium capitalize">{car.transmission}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Fuel Type:</span>
                  <span className="ml-2 font-medium capitalize">{car.fuelType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Seats:</span>
                  <span className="ml-2 font-medium">{car.seats}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <span className="ml-2 font-medium">{car.locationId}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Selected Period</h3>
              <div className="text-sm">
                <div>
                  <span className="text-muted-foreground">From:</span>
                  <span className="ml-2 font-medium">
                    {format(selectedRange.from, "MMM d, yyyy")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">To:</span>
                  <span className="ml-2 font-medium">
                    {format(selectedRange.to, "MMM d, yyyy")}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="ml-2 font-medium">
                    {differenceInDays(selectedRange.to, selectedRange.from) + 1} days
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-muted-foreground">Total Price:</span>
                  <span className="ml-2 font-medium">${calculateTotalPrice()}</span>
                </div>
                <div className="mt-2">
                  <span className="text-muted-foreground">Status:</span>
                  <span
                    className={cn(
                      "ml-2 font-medium",
                      isCarAvailable(selectedRange.from, selectedRange.to)
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {isCarAvailable(selectedRange.from, selectedRange.to)
                      ? "Available"
                      : "Booked"}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              disabled={!isCarAvailable(selectedRange.from, selectedRange.to)}
              onClick={handleBookNow}
            >
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 