"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { addDays, differenceInDays } from "date-fns"
import type { Booking, Car } from "@/lib/types"

interface EditBookingModalProps {
  booking: Booking | null
  cars: Car[]
  isOpen: boolean
  onClose: () => void
  onSave: (booking: Booking) => void
}

export function EditBookingModal({ booking, cars, isOpen, onClose, onSave }: EditBookingModalProps) {
  const [formData, setFormData] = useState<Booking | null>(booking)
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 3))
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  // Reset form when booking changes
  useEffect(() => {
    if (booking) {
      setFormData(booking)
      setStartDate(new Date(booking.startDate))
      setEndDate(new Date(booking.endDate))
      setTotalPrice(booking.totalPrice)
    }
  }, [booking])

  // Recalculate price when dates change
  useEffect(() => {
    if (booking && startDate && endDate) {
      const car = cars.find((c) => c.id === booking.carId)
      if (car) {
        const days = differenceInDays(endDate, startDate) || 1
        setTotalPrice(days * car.pricePerDay)
      }
    }
  }, [booking, cars, startDate, endDate])

  if (!formData) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => (prev ? { ...prev, status: value as "confirmed" | "completed" | "cancelled" } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setIsLoading(true)
    try {
      // Update booking with new dates and price
      const updatedBooking = {
        ...formData,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice,
      }

      // In a real app, you would make an API call here
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      onSave(updatedBooking)
    } finally {
      setIsLoading(false)
      onClose()
    }
  }

  const selectedCar = cars.find((c) => c.id === formData.carId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>Make changes to the booking details here.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Customer Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label>Selected Car</Label>
              <div className="rounded-md border p-2">
                {selectedCar ? (
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {selectedCar.make} {selectedCar.model} ({selectedCar.year})
                    </span>
                    <span className="text-sm text-gray-500">${selectedCar.pricePerDay} per day</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Car not found</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <DatePicker date={endDate} setDate={setEndDate} minDate={addDays(startDate, 1)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Booking Status</Label>
              <Select name="status" value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex justify-between">
                <span className="font-medium">Total Price:</span>
                <span className="text-lg font-bold">${totalPrice}</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">For {differenceInDays(endDate, startDate) || 1} days</div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
