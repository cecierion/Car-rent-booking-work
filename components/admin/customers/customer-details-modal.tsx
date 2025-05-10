"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import type { Customer, Booking, Car } from "@/lib/types"

interface CustomerDetailsModalProps {
  customer: Customer | null
  bookings: Booking[]
  cars: Car[]
  isOpen: boolean
  onClose: () => void
}

export function CustomerDetailsModal({ customer, bookings, cars, isOpen, onClose }: CustomerDetailsModalProps) {
  if (!customer) return null

  // Get customer's bookings
  const customerBookings = bookings.filter(
    (booking) => customer.bookingIds?.includes(booking.id) || booking.email === customer.email,
  )

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline"
      case "confirmed":
        return "default"
      case "completed":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Booking History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Name:</div>
                    <div>{customer.name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Email:</div>
                    <div>{customer.email}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Phone:</div>
                    <div>{customer.phone}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Status:</div>
                    <div>
                      <Badge variant={getStatusBadgeVariant(customer.status)} className="capitalize">
                        {customer.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Customer Since:</div>
                    <div>{format(new Date(customer.joinedDate), "MMM d, yyyy")}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Total Bookings:</div>
                    <div>{customer.totalBookings}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Total Spent:</div>
                    <div>${customer.totalSpent}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Average Booking Value:</div>
                    <div>
                      ${customer.totalBookings > 0 ? Math.round(customer.totalSpent / customer.totalBookings) : 0}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Last Booking:</div>
                    <div>
                      {customerBookings.length > 0
                        ? format(
                            new Date(
                              customerBookings.sort(
                                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                              )[0].createdAt,
                            ),
                            "MMM d, yyyy",
                          )
                        : "No bookings"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {customer.address && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Address Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-sm font-medium">Address:</div>
                      <div>{customer.address}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-sm font-medium">City:</div>
                      <div>{customer.city}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-sm font-medium">State/Province:</div>
                      <div>{customer.state}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-sm font-medium">Zip/Postal Code:</div>
                      <div>{customer.zipCode}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-sm font-medium">Country:</div>
                      <div>{customer.country}</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {customer.notes && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{customer.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
                <CardDescription>All bookings made by this customer</CardDescription>
              </CardHeader>
              <CardContent>
                {customerBookings.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No bookings found for this customer</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Car</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerBookings.map((booking) => {
                        const car = cars.find((c) => c.id === booking.carId)
                        return (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.id}</TableCell>
                            <TableCell>{car ? `${car.make} ${car.model}` : "Unknown"}</TableCell>
                            <TableCell>
                              <div>{format(new Date(booking.startDate), "MMM d, yyyy")}</div>
                              <div className="text-sm text-muted-foreground">
                                to {format(new Date(booking.endDate), "MMM d, yyyy")}
                              </div>
                            </TableCell>
                            <TableCell>${booking.totalPrice}</TableCell>
                            <TableCell>
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
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
