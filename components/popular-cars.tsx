"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CarCard } from "@/components/car-card"
import { useData } from "@/lib/data-context"
import type { Car } from "@/lib/types"

export function PopularCars() {
  const { cars, locations } = useData()
  const [popularCars, setPopularCars] = useState<Car[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // In a real app, you would determine popularity based on bookings or views
    // For now, we'll just take the first 3 available cars
    const available = cars.filter((car) => car.available).slice(0, 3)
    setPopularCars(available)
  }, [cars])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % popularCars.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + popularCars.length) % popularCars.length)
  }

  if (popularCars.length === 0) return null

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Most Popular Cars</h2>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {popularCars.map((car) => (
                <div key={car.id} className="w-full flex-shrink-0 px-4">
                  <div className="max-w-md mx-auto">
                    <CarCard car={car} location={locations.find((loc) => loc.id === car.locationId)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {popularCars.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full bg-white shadow-md"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-white shadow-md"
                onClick={nextSlide}
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next</span>
              </Button>
            </>
          )}

          <div className="flex justify-center mt-4 gap-2">
            {popularCars.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-primary" : "bg-gray-300"}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
