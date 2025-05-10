"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { addDays } from "date-fns"
import type { Car, Location } from "@/lib/types"
import { useData } from "@/lib/data-context"
import { generateConfirmationCode } from "@/lib/utils"

interface BookingFormProps {
  car: Car
  locations: Location[]
}

export function BookingForm({ car, locations }: BookingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addBooking, addOrUpdateCustomer } = useData()
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<{
    from: Date
    to: Date
  }>({
    from: new Date(),
    to: addDays(new Date(), 1),
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    locationId: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const selectedLocation = locations.find(loc => loc.id === formData.locationId)
      if (!selectedLocation) {
        throw new Error("Please select a location")
      }

      // Calculate total price
      const days = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))
      const totalPrice = car.pricePerDay * days

      // Generate confirmation code
      const confirmationCode = generateConfirmationCode()

      // Create new booking
      const newBooking = {
        id: `booking-${Date.now()}`,
        carId: car.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        startDate: date.from.toISOString(),
        endDate: date.to.toISOString(),
        locationId: formData.locationId,
        status: "pending",
        totalPrice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        confirmationCode,
      }

      // Add booking to context
      addBooking(newBooking)

      // Add or update customer
      addOrUpdateCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bookingId: newBooking.id,
        totalSpent: totalPrice,
      })

      toast({
        title: "Booking Successful!",
        description: (
          <div className="mt-2 space-y-2">
            <p>Thank you for booking the {car.make} {car.model}.</p>
            <p className="font-medium">Your confirmation code is: {confirmationCode}</p>
            <p>We will contact you shortly to confirm your reservation.</p>
          </div>
        ),
        duration: 5000,
      })

      // Redirect to homepage after a short delay to show the toast
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to book car",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({ ...prev, locationId: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            required
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Pickup Location</Label>
          <Select value={formData.locationId} onValueChange={handleLocationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Date Range</Label>
        <DatePickerWithRange date={date} onDateChange={setDate} />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Booking..." : "Book Now"}
      </Button>
    </form>
  )
} 