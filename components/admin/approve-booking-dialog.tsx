"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Booking, Car, Location } from "@/lib/types"
import { format } from "date-fns"
import { useData } from "@/lib/data-context"

interface ApproveBookingDialogProps {
  booking: Booking | null
  cars: Car[]
  locations?: Location[]
  isOpen: boolean
  onClose: () => void
  onApprove: (bookingId: string) => void
}

export function ApproveBookingDialog({
  booking,
  cars = [],
  locations = [],
  isOpen,
  onClose,
  onApprove,
}: ApproveBookingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateBooking } = useData()

  if (!booking) return null

  const car = cars.find((c) => c.id === booking.carId)
  const location = booking.locationId && locations ? locations.find((l) => l.id === booking.locationId) : undefined

  const handleApprove = async () => {
    if (!booking) return

    setIsSubmitting(true)
    try {
      // Update booking status to confirmed
      const updatedBooking = {
        ...booking,
        status: "confirmed" as const,
        updatedAt: new Date().toISOString(),
      }

      // Update booking in context
      updateBooking(updatedBooking)

      // Call the parent's onApprove callback
      onApprove(booking.id)
      onClose()
    } catch (error) {
      console.error("Error approving booking:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this booking? This will confirm the reservation and notify the customer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold">Booking Details</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Confirmation Code:</span>
                <span className="font-medium">{booking.confirmationCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{booking.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Car:</span>
                <span className="font-medium">{car ? `${car.make} ${car.model} (${car.year})` : "Unknown"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{location ? location.name : "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dates:</span>
                <span className="font-medium">
                  {format(new Date(booking.startDate), "MMM d, yyyy")} -{" "}
                  {format(new Date(booking.endDate), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Price:</span>
                <span className="font-medium">${booking.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApprove} disabled={isSubmitting}>
            {isSubmitting ? "Approving..." : "Approve Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
