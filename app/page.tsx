"use client"

import { useState } from "react"
import { CarCard } from "@/components/car-card"
import { Hero } from "@/components/hero"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PopularCars } from "@/components/popular-cars"
import { ServicesSection } from "@/components/services-section"
import { BlogSection } from "@/components/blog-section"
import { ReviewsSection } from "@/components/reviews-section"
import { useData } from "@/lib/data-context"
import { isWithinInterval } from "date-fns"
import type { Car } from "@/lib/types"

export default function Home() {
  const { cars, bookings, locations } = useData()
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars.filter((car) => car.available))
  const [isFiltered, setIsFiltered] = useState(false)
  const [activeLocation, setActiveLocation] = useState<string | null>(null)

  const handleSearch = (location: string, pickupDate: Date, returnDate: Date) => {
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
          (isWithinInterval(new Date(booking.startDate), { start: pickupDate, end: returnDate }) ||
            isWithinInterval(new Date(booking.endDate), { start: pickupDate, end: returnDate }) ||
            (new Date(booking.startDate) <= pickupDate && new Date(booking.endDate) >= returnDate)),
      )

      // Car is available if there are no conflicting bookings
      return conflictingBookings.length === 0
    })

    setFilteredCars(availableCars)
    setIsFiltered(true)
    setActiveLocation(location || null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <Hero onSearch={handleSearch} locations={locations} />
      <PopularCars />
      <div className="container mx-auto px-4 py-12" id="cars">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            {isFiltered ? `Available Cars (${filteredCars.length})` : "Available Cars"}
          </h2>
          {isFiltered && (
            <p className="mt-2 text-muted-foreground">
              Showing cars available for your selected dates
              {activeLocation && ` in ${locations.find((loc) => loc.id === activeLocation)?.name}`}
            </p>
          )}
        </div>

        {filteredCars.length === 0 ? (
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
      <ServicesSection />
      <BlogSection />
      <ReviewsSection />
      <Footer />
    </div>
  )
}
