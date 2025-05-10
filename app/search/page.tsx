"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CarCard } from "@/components/car-card"
import { Navbar } from "@/components/navbar"
import { useData } from "@/lib/data-context"
import { isWithinInterval } from "date-fns"
import type { Car } from "@/lib/types"
import { Footer } from "@/components/footer"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CalendarDays, MapPin } from "lucide-react"

export default function SearchResults() {
  const { cars, bookings, locations } = useData()
  const searchParams = useSearchParams()
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const location = searchParams.get("location")
    const pickupDate = searchParams.get("pickupDate")
    const returnDate = searchParams.get("returnDate")

    if (pickupDate && returnDate) {
      const pickupDateObj = new Date(pickupDate)
      const returnDateObj = new Date(returnDate)

      // Filter cars based on availability during the selected date range
      const availableCars = cars.filter((car) => {
        // Skip already unavailable cars
        if (!car.available) return false

        // Filter by location if selected
        if (location && car.locationId !== location) return false

        // Check if car has any bookings in the selected date range
        const conflictingBookings = bookings.filter(
          (booking) =>
            booking.carId === car.id &&
            booking.status !== "cancelled" &&
            // Check if booking overlaps with selected dates
            (isWithinInterval(new Date(booking.startDate), { start: pickupDateObj, end: returnDateObj }) ||
              isWithinInterval(new Date(booking.endDate), { start: pickupDateObj, end: returnDateObj }) ||
              (new Date(booking.startDate) <= pickupDateObj && new Date(booking.endDate) >= returnDateObj)),
        )

        // Car is available if there are no conflicting bookings
        return conflictingBookings.length === 0
      })

      setFilteredCars(availableCars)
    } else {
      setFilteredCars(cars.filter((car) => car.available))
    }

    setIsLoading(false)
  }, [searchParams, cars, bookings, locations])

  const locationName = searchParams.get("location")
    ? locations.find((loc) => loc.id === searchParams.get("location"))?.name
    : null

  const pickupDate = searchParams.get("pickupDate")
    ? new Date(searchParams.get("pickupDate") as string).toLocaleDateString()
    : null

  const returnDate = searchParams.get("returnDate")
    ? new Date(searchParams.get("returnDate") as string).toLocaleDateString()
    : null

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Search Results</h1>

          {(locationName || pickupDate) && (
            <Alert className="mb-6">
              <AlertTitle>Search Criteria</AlertTitle>
              <AlertDescription>
                <div className="flex flex-col gap-2 mt-2">
                  {locationName && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Location: {locationName}</span>
                    </div>
                  )}
                  {pickupDate && returnDate && (
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        Dates: {pickupDate} to {returnDate}
                      </span>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-xl font-medium">No cars available for the selected criteria</h3>
              <p className="mt-2 text-muted-foreground">Try selecting different dates or browse our entire fleet</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} location={locations.find((loc) => loc.id === car.locationId)} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
