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
import { Textarea } from "@/components/ui/textarea"
import type { Booking, Car, Location } from "@/lib/types"
import { format } from "date-fns"
import { useData } from "@/lib/data-context"

interface RejectBookingDialogProps {
  booking: Booking | null
  cars?: Car[]
  locations?: Location[]
  isOpen: boolean
  onClose: () => void
  onReject: (bookingId: string, reason: string) => void
}

export function RejectBookingDialog({
  booking,
  cars = [],
  locations = [],
  isOpen,
  onClose,
  onReject,
}: RejectBookingDialogProps) {
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { updateBooking } = useData()

  if (!booking) return null

  const car = Array.isArray(cars) ? cars.find((c) => c.id === booking.carId) : undefined
  const location =
    Array.isArray(locations) && booking.locationId ? locations.find((l) => l.id === booking.locationId) : undefined

  const handleReject = async () => {
    if (!reason.trim()) return
    if (!booking) return

    setIsLoading(true)
    try {
      // Update booking status to cancelled with reason
      const updatedBooking = {
        ...booking,
        status: "cancelled" as const,
        cancelReason: reason,
        updatedAt: new Date().toISOString(),
      }

      // Update booking in context
      updateBooking(updatedBooking)

      // Call the parent's onReject callback
      onReject(booking.id, reason)
      onClose()
    } catch (error) {
      console.error("Error rejecting booking:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Booking</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this booking. This will be included in the notification to the
            customer.
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

          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Rejection Reason
            </label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for rejecting this booking..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReject} disabled={isLoading || !reason.trim()}>
            {isLoading ? "Rejecting..." : "Reject Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
