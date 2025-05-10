"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { useData } from "@/lib/data-context"
import { format } from "date-fns"
import { CheckCircle2 } from "lucide-react"

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { bookings, cars, locations } = useData()
  const [booking, setBooking] = useState<any>(null)
  const [car, setCar] = useState<any>(null)
  const [location, setLocation] = useState<any>(null)

  useEffect(() => {
    // Find the booking by ID
    const foundBooking = bookings.find((b) => b.id === params.id)

    if (foundBooking) {
      setBooking(foundBooking)

      // Find the car
      const foundCar = cars.find((c) => c.id === foundBooking.carId)
      if (foundCar) {
        setCar(foundCar)
      }

      // Find the location
      if (foundBooking.locationId) {
        const foundLocation = locations.find((l) => l.id === foundBooking.locationId)
        if (foundLocation) {
          setLocation(foundLocation)
        }
      }
    } else {
      // If booking not found, redirect to home
      router.push("/")
    }
  }, [params.id, bookings, cars, locations, router])

  if (!booking || !car) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container mx-auto p-8">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container mx-auto p-4 py-12 md:p-8">
        <div className="mx-auto max-w-3xl">
          <Card className="border-green-100">
            <CardHeader className="bg-green-50 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">Booking Request Received!</CardTitle>
              <CardDescription className="text-green-700">
                Your booking request has been submitted and is pending approval
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold">Booking Details</h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">{booking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pickup Date:</span>
                    <span className="font-medium">{format(new Date(booking.startDate), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return Date:</span>
                    <span className="font-medium">{format(new Date(booking.endDate), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Price:</span>
                    <span className="font-medium">${booking.totalPrice}</span>
                  </div>
                  {location && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pickup Location:</span>
                      <span className="font-medium">{location.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold">Car Details</h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Car:</span>
                    <span className="font-medium">
                      {car.make} {car.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year:</span>
                    <span className="font-medium">{car.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transmission:</span>
                    <span className="font-medium">{car.transmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Type:</span>
                    <span className="font-medium">{car.fuelType}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
                <h3 className="mb-2 font-semibold">What's Next?</h3>
                <p className="text-sm">
                  Your booking request is now pending approval. You will receive an email confirmation once your booking
                  is approved. If you have any questions, please contact our customer service.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push("/")}>
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
