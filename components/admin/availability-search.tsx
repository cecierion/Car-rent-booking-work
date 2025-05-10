"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/date-picker"
import { Label } from "@/components/ui/label"
import { addDays, isWithinInterval } from "date-fns"
import type { Car } from "@/lib/types"
import { bookingsData } from "@/lib/data"

interface AvailabilitySearchProps {
  cars: Car[]
  onResults: (cars: Car[]) => void
  onDateRangeChange?: (range: { from: Date | null, to: Date | null }) => void
}

export function AvailabilitySearch({ cars, onResults, onDateRangeChange }: AvailabilitySearchProps) {
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7))
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (onDateRangeChange) {
      onDateRangeChange({ from: startDate, to: endDate })
    }
  }, [startDate, endDate, onDateRangeChange])

  const handleSearch = () => {
    setIsSearching(true)

    // In a real app, this would be a server-side or API call
    setTimeout(() => {
      // Filter out cars that have bookings overlapping with the selected date range
      const availableCars = cars.filter((car) => {
        // Skip already unavailable cars
        if (!car.available) return false

        // Check if car has any bookings in the selected date range
        const conflictingBookings = bookingsData.filter(
          (booking) =>
            booking.carId === car.id &&
            // Check if booking overlaps with selected dates
            (isWithinInterval(new Date(booking.startDate), { start: startDate, end: endDate }) ||
              isWithinInterval(new Date(booking.endDate), { start: startDate, end: endDate }) ||
              (new Date(booking.startDate) <= startDate && new Date(booking.endDate) >= endDate)),
        )

        // Car is available if there are no conflicting bookings
        return conflictingBookings.length === 0
      })

      onResults(availableCars)
      setIsSearching(false)
    }, 500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Available Cars</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <DatePicker date={startDate} setDate={setStartDate} minDate={new Date()} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <DatePicker date={endDate} setDate={setEndDate} minDate={addDays(startDate, 1)} />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} disabled={isSearching} className="w-full">
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
