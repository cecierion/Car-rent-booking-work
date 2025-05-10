"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PdfGenerator } from "@/components/admin/pdf-generator"
import { EmailScheduler } from "@/components/admin/email-scheduler"
import type { Booking, Car, Location, Customer } from "@/lib/types"

interface BookingDetailsProps {
  booking: Booking
  car: Car
  location: Location
  customer?: Customer
  cars: Car[]
  locations: Location[]
}

export function BookingDetails({ booking, car, location, customer, cars, locations }: BookingDetailsProps) {
  const [activeTab, setActiveTab] = useState("details")

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>View and manage booking information</CardDescription>
          </div>
          <Badge
            variant={
              booking.status === "pending"
                ? "outline"
                : booking.status === "confirmed"
                  ? "default"
                  : booking.status === "completed"
                    ? "success"
                    : "destructive"
            }
            className={booking.status === "pending" ? "border-amber-500 text-amber-500" : ""}
          >
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="emails">Email Scheduler</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-medium">Customer Information</h3>
                <div className="rounded-md border p-4">
                  <div className="mb-2">
                    <span className="text-sm font-medium">Name:</span> <span>{booking.name}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-medium">Email:</span> <span>{booking.email}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Phone:</span> <span>{booking.phone}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Booking Information</h3>
                <div className="rounded-md border p-4">
                  <div className="mb-2">
                    <span className="text-sm font-medium">Booking ID:</span> <span>{booking.id}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-medium">Created:</span>{" "}
                    <span>{format(new Date(booking.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Total Price:</span>{" "}
                    <span>${booking.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Vehicle Information</h3>
                <div className="rounded-md border p-4">
                  <div className="mb-2">
                    <span className="text-sm font-medium">Vehicle:</span>{" "}
                    <span>
                      {car.make} {car.model} ({car.year})
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-medium">Transmission:</span> <span>{car.transmission}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Fuel Type:</span> <span>{car.fuelType}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Rental Details</h3>
                <div className="rounded-md border p-4">
                  <div className="mb-2">
                    <span className="text-sm font-medium">Pickup Location:</span> <span>{location.name}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-medium">Pickup Date:</span>{" "}
                    <span>{format(new Date(booking.startDate), "MMM d, yyyy")}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Return Date:</span>{" "}
                    <span>{format(new Date(booking.endDate), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <PdfGenerator booking={booking} car={car} location={location} customer={customer} />
          </TabsContent>

          <TabsContent value="emails" className="mt-4">
            <EmailScheduler booking={booking} car={car} location={location} cars={cars} locations={locations} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
