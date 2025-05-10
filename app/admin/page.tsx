"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "@/components/admin-header"
import { EditCarModal } from "@/components/admin/edit-car-modal"
import { AddCarModal } from "@/components/admin/add-car-modal"
import { DeleteCarDialog } from "@/components/admin/delete-car-dialog"
import { EditBookingModal } from "@/components/admin/edit-booking-modal"
import { CancelBookingDialog } from "@/components/admin/cancel-booking-dialog"
import { BookingHistoryDialog } from "@/components/admin/booking-history-dialog"
import { AvailabilitySearch } from "@/components/admin/availability-search"
import { LocationsManager } from "@/components/admin/locations-manager"
import { ApproveBookingDialog } from "@/components/admin/approve-booking-dialog"
import { RejectBookingDialog } from "@/components/admin/reject-booking-dialog"
import { format } from "date-fns"
import { AuthGuard } from "@/components/auth-guard"
import { useData } from "@/lib/data-context"
import type { Car, Booking } from "@/lib/types"
import { Edit, History, MapPin, Plus, Trash2, XCircle, CheckCircle, AlertTriangle } from "lucide-react"
import { BookCarModal } from "@/components/admin/book-car-modal"

export default function AdminDashboard() {
  const { cars, bookings, locations, updateCar, addCar, deleteCar, setBookings } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [displayedCars, setDisplayedCars] = useState<Car[]>(cars)
  const [bookingHistory, setBookingHistory] = useState<any[]>([])

  // Car state
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [isEditCarModalOpen, setIsEditCarModalOpen] = useState(false)
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false)
  const [isDeleteCarDialogOpen, setIsDeleteCarDialogOpen] = useState(false)

  // Booking state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isEditBookingModalOpen, setIsEditBookingModalOpen] = useState(false)
  const [isCancelBookingDialogOpen, setIsCancelBookingDialogOpen] = useState(false)
  const [isBookingHistoryDialogOpen, setIsBookingHistoryDialogOpen] = useState(false)
  const [isApproveBookingDialogOpen, setIsApproveBookingDialogOpen] = useState(false)
  const [isRejectBookingDialogOpen, setIsRejectBookingDialogOpen] = useState(false)

  // Location state
  const [isLocationsManagerOpen, setIsLocationsManagerOpen] = useState(false)

  const [activeTab, setActiveTab] = useState("cars")

  // Add searchDateRange state
  const [searchDateRange, setSearchDateRange] = useState<{ from: Date | null, to: Date | null }>({ from: null, to: null })

  // Update displayed cars when cars change
  useEffect(() => {
    if (activeTab === "cars") {
      const filtered = cars.filter((car) => `${car.make} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase()))
      setDisplayedCars(filtered)
    }
  }, [cars, activeTab, searchTerm])

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Count pending bookings
  const pendingBookingsCount = bookings.filter((booking) => booking.status === "pending").length

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (activeTab === "cars") {
      const filtered = cars.filter((car) => `${car.make} ${car.model}`.toLowerCase().includes(term.toLowerCase()))
      setDisplayedCars(filtered)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "cars") {
      const filtered = cars.filter((car) => `${car.make} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase()))
      setDisplayedCars(filtered)
    }
  }

  // Car handlers
  const handleEditCar = (car: Car) => {
    setSelectedCar(car)
    setIsEditCarModalOpen(true)
  }

  const handleDeleteCar = (car: Car) => {
    setSelectedCar(car)
    setIsDeleteCarDialogOpen(true)
  }

  const handleSaveCar = (updatedCar: Car) => {
    updateCar(updatedCar)
  }

  const handleAddCar = (newCar: Omit<Car, "id">) => {
    addCar(newCar)
  }

  const handleDeleteConfirm = (carId: string) => {
    deleteCar(carId)
  }

  // Booking handlers
  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsEditBookingModalOpen(true)
  }

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsCancelBookingDialogOpen(true)
  }

  const handleApproveBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsApproveBookingDialogOpen(true)
  }

  const handleRejectBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsRejectBookingDialogOpen(true)
  }

  const handleViewBookingHistory = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsBookingHistoryDialogOpen(true)
  }

  const handleSaveBooking = (updatedBooking: Booking) => {
    // Update bookings
    const updatedBookings = bookings.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking))
    setBookings(updatedBookings)
  }

  const handleCancelBookingConfirm = (bookingId: string, reason: string) => {
    // Update booking status
    const updatedBookings = bookings.map((booking) =>
      booking.id === bookingId
        ? {
          ...booking,
          status: "cancelled" as const,
          cancelReason: reason,
        }
        : booking,
    )
    setBookings(updatedBookings)
  }

  const handleApproveBookingConfirm = (bookingId: string) => {
    // Update booking status
    const updatedBookings = bookings.map((booking) =>
      booking.id === bookingId
        ? {
          ...booking,
          status: "confirmed" as const,
        }
        : booking,
    )
    setBookings(updatedBookings)
  }

  const handleRejectBookingConfirm = (bookingId: string, reason: string) => {
    // Update booking status
    const updatedBookings = bookings.map((booking) =>
      booking.id === bookingId
        ? {
          ...booking,
          status: "cancelled" as const,
          cancelReason: reason,
        }
        : booking,
    )
    setBookings(updatedBookings)
  }

  const handleAvailabilityResults = (availableCars: Car[]) => {
    setDisplayedCars(availableCars)
    setActiveTab("cars")
  }

  const handleDeleteBooking = (bookingId: string) => {
    setBookings(bookings.filter((b) => b.id !== bookingId))
  }

  const handleConfirmBooking = (bookingId: string) => {
    setBookings(bookings.map((b) => b.id === bookingId ? { ...b, status: "confirmed" } : b))
  }

  const [isBookCarModalOpen, setIsBookCarModalOpen] = useState(false)

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <AdminHeader />
        <div className="container mx-auto p-4 py-8">
          <div className="flex justify-between mb-8">
            <AvailabilitySearch cars={cars} onResults={handleAvailabilityResults} onDateRangeChange={setSearchDateRange} />
            <Button onClick={() => setIsLocationsManagerOpen(true)} className="ml-4">
              <MapPin className="mr-2 h-4 w-4" /> Manage Locations
            </Button>
          </div>

          {pendingBookingsCount > 0 && (
            <div className="mb-6">
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                    <div>
                      <h3 className="font-medium">Pending Bookings</h3>
                      <p className="text-sm text-amber-700">
                        You have {pendingBookingsCount} booking requests that need your attention
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-amber-600 text-amber-600 hover:bg-amber-50"
                    onClick={() => {
                      setActiveTab("bookings")
                      setSearchTerm("pending")
                    }}
                  >
                    Review Bookings
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>Manage your car rental inventory and bookings</CardDescription>
              </div>
              <Button onClick={() => setIsAddCarModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add New Car
              </Button>
              <Button onClick={() => setIsBookCarModalOpen(true)} className="ml-2">
                <Plus className="mr-2 h-4 w-4" /> Book Car
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Input
                  placeholder="Search cars or bookings..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="max-w-md"
                />
              </div>

              <Tabs defaultValue="cars" value={activeTab} onValueChange={handleTabChange}>
                <TabsList>
                  <TabsTrigger value="cars">Cars</TabsTrigger>
                  <TabsTrigger value="bookings">
                    Bookings
                    {pendingBookingsCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {pendingBookingsCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="cars" className="mt-6">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Car</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>Price/Day</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayedCars.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              No cars found matching your criteria
                            </TableCell>
                          </TableRow>
                        ) : (
                          displayedCars.map((car) => (
                            <TableRow key={car.id}>
                              <TableCell className="font-medium">
                                {car.make} {car.model}
                              </TableCell>
                              <TableCell>{car.year}</TableCell>
                              <TableCell>${car.pricePerDay}</TableCell>
                              <TableCell>
                                {car.locationId ? (
                                  locations.find((loc) => loc.id === car.locationId)?.name || "Unknown"
                                ) : (
                                  <span className="text-muted-foreground italic">Not assigned</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant={car.available ? "success" : "destructive"}>
                                  {car.available ? "Available" : "Unavailable"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="icon" onClick={() => handleEditCar(car)}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDeleteCar(car)}
                                    className="text-red-500 hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="bookings" className="mt-6">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Car</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              No bookings found matching your criteria
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredBookings.map((booking) => {
                            const car = cars.find((c) => c.id === booking.carId)
                            return (
                              <TableRow key={booking.id}>
                                <TableCell>
                                  <div className="font-medium">{booking.name}</div>
                                  <div className="text-sm text-gray-500">{booking.email}</div>
                                </TableCell>
                                <TableCell>{car ? `${car.make} ${car.model}` : "Unknown"}</TableCell>
                                <TableCell>
                                  <div>{format(new Date(booking.startDate), "MMM d, yyyy")}</div>
                                  <div className="text-sm text-gray-500">
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
                                <TableCell>
                                  <div className="flex gap-2">
                                    {booking.status === "pending" && (
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleConfirmBooking(booking.id)}
                                        className="text-green-500 hover:text-green-600"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                        <span className="sr-only">Confirm</span>
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleDeleteBooking(booking.id)}
                                      className="text-red-500 hover:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleEditBooking(booking)}
                                      disabled={booking.status === "cancelled"}
                                    >
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleCancelBooking(booking)}
                                      disabled={booking.status !== "confirmed"}
                                      className="text-red-500 hover:text-red-600"
                                    >
                                      <XCircle className="h-4 w-4" />
                                      <span className="sr-only">Cancel</span>
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleViewBookingHistory(booking)}
                                    >
                                      <History className="h-4 w-4" />
                                      <span className="sr-only">History</span>
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Car Modals */}
      <EditCarModal
        car={selectedCar}
        locations={locations}
        isOpen={isEditCarModalOpen}
        onClose={() => setIsEditCarModalOpen(false)}
        onSave={handleSaveCar}
      />

      <AddCarModal
        isOpen={isAddCarModalOpen}
        locations={locations}
        onClose={() => setIsAddCarModalOpen(false)}
        onAdd={handleAddCar}
      />

      <DeleteCarDialog
        car={selectedCar}
        isOpen={isDeleteCarDialogOpen}
        onClose={() => setIsDeleteCarDialogOpen(false)}
        onDelete={handleDeleteConfirm}
      />

      {/* Booking Modals */}
      <EditBookingModal
        booking={selectedBooking}
        cars={cars}
        isOpen={isEditBookingModalOpen}
        onClose={() => setIsEditBookingModalOpen(false)}
        onSave={handleSaveBooking}
      />

      <CancelBookingDialog
        booking={selectedBooking}
        cars={cars}
        locations={locations}
        isOpen={isCancelBookingDialogOpen}
        onClose={() => setIsCancelBookingDialogOpen(false)}
        onCancel={handleCancelBookingConfirm}
      />

      <ApproveBookingDialog
        booking={selectedBooking}
        cars={cars}
        locations={locations}
        isOpen={isApproveBookingDialogOpen}
        onClose={() => setIsApproveBookingDialogOpen(false)}
        onApprove={handleApproveBookingConfirm}
      />

      <RejectBookingDialog
        booking={selectedBooking}
        cars={cars}
        locations={locations}
        isOpen={isRejectBookingDialogOpen}
        onClose={() => setIsRejectBookingDialogOpen(false)}
        onReject={handleRejectBookingConfirm}
      />

      <BookingHistoryDialog
        bookingId={selectedBooking?.id || ""}
        history={bookingHistory}
        isOpen={isBookingHistoryDialogOpen}
        onClose={() => setIsBookingHistoryDialogOpen(false)}
      />

      {/* Locations Manager */}
      <LocationsManager isOpen={isLocationsManagerOpen} onClose={() => setIsLocationsManagerOpen(false)} />

      <BookCarModal
        isOpen={isBookCarModalOpen}
        onClose={() => setIsBookCarModalOpen(false)}
        cars={cars}
        locations={locations}
        onBook={(booking) => {
          const car = cars.find((c) => c.id === booking.carId)
          let days = 1
          if (booking.startDate && booking.endDate) {
            const start = new Date(booking.startDate)
            const end = new Date(booking.endDate)
            days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)
          }
          const totalPrice = car ? car.pricePerDay * days : 0
          setBookings((prev) => [
            { ...booking, id: `booking-${Date.now()}`, totalPrice },
            ...prev,
          ])
        }}
        bookings={bookings}
        initialDateRange={searchDateRange}
      />
    </AuthGuard>
  )
}
