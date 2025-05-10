"use server"

import { carsData, locationsData, bookingsData, customersData, notificationsData } from "./data"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Booking, Car, Location, Notification } from "@/lib/types"

export async function getCars() {
  return [...carsData]
}

export async function getCar(carId: string): Promise<Car | null> {
  // In a real app, you would fetch the car from your database
  // For now, we'll just return a mock car
  return {
    id: carId,
    make: "Mock",
    model: "Car",
    year: 2024,
    transmission: "automatic",
    fuelType: "gasoline",
    seats: 5,
    pricePerDay: 100,
    available: true,
  }
}

export async function getLocations() {
  return [...locationsData]
}

export async function getLocation(id: string) {
  return locationsData.find((location) => location.id === id) || null
}

export async function getBookings() {
  return [...bookingsData]
}

export async function getBooking(id: string) {
  return bookingsData.find((booking) => booking.id === id) || null
}

export async function getCustomers() {
  return [...customersData]
}

export async function getCustomer(id: string) {
  return customersData.find((customer) => customer.id === id) || null
}

export async function getCustomerByEmail(email: string) {
  return customersData.find((customer) => customer.email === email) || null
}

export async function getBookingsForCustomer(customerId: string) {
  const customer = await getCustomer(customerId)
  if (!customer) return []
  return bookingsData.filter((booking) => booking.customerId === customerId)
}

export async function getBookingsForCar(carId: string) {
  return bookingsData.filter((booking) => booking.carId === carId)
}

export async function getBookingsForLocation(locationId: string) {
  return bookingsData.filter((booking) => booking.locationId === locationId)
}

export async function isCarAvailable(carId: string, startDate: string, endDate: string) {
  const car = await getCar(carId)
  if (!car || !car.available) return false
  // Add logic to check if the car is available for the given date range
  return true
}

export async function getAvailableCars(startDate: string, endDate: string) {
  const cars = await getCars()
  const availableCars = []
  for (const car of cars) {
    if (await isCarAvailable(car.id, startDate, endDate)) {
      availableCars.push(car)
    }
  }
  return availableCars
}

export async function getBookingHistoryForCar(carId: string) {
  return bookingsData.filter((booking) => booking.carId === carId)
}

export async function getNotifications() {
  return [...notificationsData]
}

export async function getUnreadNotificationsCount() {
  return notificationsData.filter((notification) => !notification.read).length
}

export async function getHighPriorityNotifications() {
  return notificationsData.filter((notification) => notification.priority === "high")
}

export async function getRecentNotifications(count = 5) {
  return [...notificationsData]
    .sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
    .slice(0, count)
}

interface BookingData {
  carId: string
  name: string
  email: string
  phone: string
  startDate: string
  endDate: string
  locationId: string
}

/**
 * Book a car
 */
export async function bookCar(bookingData: BookingData) {
  try {
    const car = await getCar(bookingData.carId)
    if (!car) {
      throw new Error("Car not found")
    }

    // Calculate total price
    const start = new Date(bookingData.startDate)
    const end = new Date(bookingData.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const totalPrice = car.pricePerDay * days

    // Create booking object
    const booking = {
      id: `booking-${Date.now()}`,
      carId: bookingData.carId,
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
      locationId: bookingData.locationId,
    }

    // Here you would typically save the booking to your database
    // For now, we'll just return a success response
    revalidatePath("/bookings")
    return {
      success: true,
      bookingId: booking.id,
      status: booking.status,
    }
  } catch (error) {
    console.error("Error booking car:", error)
    return {
      success: false,
      error: "Failed to book car",
    }
  }
}

/**
 * Create a new booking
 */
export async function createBooking(formData: FormData) {
  try {
    // In a real app, you would save the booking to your database
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a booking ID
    const bookingId = `booking-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    // Create a notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: "new_booking",
      title: "New Booking",
      message: `New booking request received for ${formData.get("firstName")} ${formData.get("lastName")}`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "high",
    }

    notificationsData.unshift(newNotification)

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/admin/analytics")

    // Redirect to the confirmation page
    redirect(`/confirmation/${bookingId}`)
  } catch (error) {
    console.error("Error creating booking:", error)
    throw new Error("Failed to create booking")
  }
}

/**
 * Approve a booking
 */
export async function approveBooking(bookingId: string, booking?: Booking, car?: Car, location?: Location) {
  try {
    // Ensure we have the required data
    if (!booking || !car || !location) {
      throw new Error("Missing required data for booking approval")
    }

    // In a real app, you would update the booking status in your database
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: "booking_update",
      title: "Booking Approved",
      message: `Booking #${bookingId} has been approved`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "medium",
    }

    notificationsData.unshift(newNotification)

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/admin/analytics")

    return { success: true }
  } catch (error) {
    console.error("Error approving booking:", error)
    throw new Error("Failed to approve booking")
  }
}

/**
 * Reject a booking
 */
export async function rejectBooking(
  bookingId: string,
  reason: string,
  booking?: Booking,
  car?: Car,
  location?: Location,
) {
  try {
    // Ensure we have the required data
    if (!booking || !car || !location) {
      throw new Error("Missing required data for booking rejection")
    }

    // In a real app, you would update the booking status in your database
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: "booking_update",
      title: "Booking Rejected",
      message: `Booking #${bookingId} has been rejected`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "medium",
    }

    notificationsData.unshift(newNotification)

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/admin/analytics")

    return { success: true }
  } catch (error) {
    console.error("Error rejecting booking:", error)
    throw new Error("Failed to reject booking")
  }
}

/**
 * Cancel a booking
 */
export async function cancelBooking(
  bookingId: string,
  reason: string,
  booking?: Booking,
  car?: Car,
  location?: Location,
) {
  try {
    // Ensure we have the required data
    if (!booking || !car || !location) {
      throw new Error("Missing required data for booking cancellation")
    }

    // In a real app, you would update the booking status in your database
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: "booking_cancelled",
      title: "Booking Cancelled",
      message: `Booking #${bookingId} has been cancelled`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "medium",
    }

    notificationsData.unshift(newNotification)

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/admin/analytics")

    return { success: true }
  } catch (error) {
    console.error("Error cancelling booking:", error)
    throw new Error("Failed to cancel booking")
  }
}

/**
 * Clear all notifications
 */
export async function clearNotifications() {
  try {
    // In a real app, you would clear notifications from your database
    notificationsData.length = 0

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/admin/notifications")

    return { success: true }
  } catch (error) {
    console.error("Error clearing notifications:", error)
    throw new Error("Failed to clear notifications")
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    // In a real app, you would update the notification in your database
    const notification = notificationsData.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
    }

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/admin/notifications")

    return { success: true }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw new Error("Failed to mark notification as read")
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead() {
  try {
    // In a real app, you would update all notifications in your database
    notificationsData.forEach((notification) => {
      notification.read = true
    })

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/admin/notifications")

    return { success: true }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    throw new Error("Failed to mark all notifications as read")
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string) {
  try {
    // In a real app, you would delete the notification from your database
    const index = notificationsData.findIndex((n) => n.id === notificationId)
    if (index !== -1) {
      notificationsData.splice(index, 1)
    }

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/admin/notifications")

    return { success: true }
  } catch (error) {
    console.error("Error deleting notification:", error)
    throw new Error("Failed to delete notification")
  }
}

/**
 * Create a test notification
 */
export async function createTestNotification(type: string) {
  try {
    // Create a test notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: type as Notification["type"],
      title: `Test ${type} Notification`,
      message: `This is a test ${type} notification`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "low",
    }

    notificationsData.unshift(newNotification)

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/admin/notifications")

    return { success: true }
  } catch (error) {
    console.error("Error creating test notification:", error)
    throw new Error("Failed to create test notification")
  }
}

/**
 * Update a customer
 */
export async function updateCustomer(customerId: string, formData: FormData) {
  try {
    // In a real app, you would update the customer in your database
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: "customer_update",
      title: "Customer Updated",
      message: `Customer ${formData.get("name")} has been updated`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "low",
    }

    notificationsData.unshift(newNotification)

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/admin/customers")

    return { success: true }
  } catch (error) {
    console.error("Error updating customer:", error)
    throw new Error("Failed to update customer")
  }
}

/**
 * Delete a customer
 */
export async function deleteCustomer(customerId: string) {
  try {
    // In a real app, you would delete the customer from your database
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: "customer_update",
      title: "Customer Deleted",
      message: `Customer has been deleted`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "low",
    }

    notificationsData.unshift(newNotification)

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/admin/customers")

    return { success: true }
  } catch (error) {
    console.error("Error deleting customer:", error)
    throw new Error("Failed to delete customer")
  }
}

/**
 * Add a new customer
 */
export async function addCustomer(formData: FormData) {
  try {
    // In a real app, you would save the customer to your database
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: "customer_update",
      title: "New Customer",
      message: `New customer ${formData.get("name")} has been added`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "low",
    }

    notificationsData.unshift(newNotification)

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/admin/customers")

    return { success: true }
  } catch (error) {
    console.error("Error adding customer:", error)
    throw new Error("Failed to add customer")
  }
}

export async function sendConfirmationEmail(bookingId: string) {
  // This is a placeholder function
  return {
    success: true,
  }
}

export async function getSampleBooking() {
  return {
    id: "sample-booking",
    carId: "car-1",
    customerId: "customer-1",
    startDate: "2023-01-01",
    endDate: "2023-01-07",
    totalPrice: 700,
    status: "confirmed",
    createdAt: "2023-01-01T00:00:00Z",
    locationId: "location-1",
  }
}

export async function getSampleCustomer() {
  return {
    id: "sample-customer",
    name: "Sample Customer",
    email: "sample@example.com",
    phone: "123-456-7890",
    bookingId: "sample-booking",
    totalSpent: 700,
  }
}

/**
 * Add a new car to the fleet
 */
export async function addCar(formData: FormData) {
  try {
    // Generate a unique ID for the car
    const carId = `car-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    // Create the car object
    const car: Car = {
      id: carId,
      make: formData.get("make") as string,
      model: formData.get("model") as string,
      year: parseInt(formData.get("year") as string),
      transmission: formData.get("transmission") as string,
      fuelType: formData.get("fuelType") as string,
      seats: parseInt(formData.get("seats") as string),
      pricePerDay: parseFloat(formData.get("pricePerDay") as string),
      available: true,
      image: formData.get("image") as string,
      description: formData.get("description") as string,
      locationId: formData.get("locationId") as string,
      popularity: 0,
    }

    // In a real app, you would save the car to your database
    carsData.push(car)

    // Create a notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: "system",
      title: "New Car Added",
      message: `${car.make} ${car.model} (${car.year}) has been added to the fleet`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "medium",
    }

    notificationsData.unshift(newNotification)

    // Revalidate paths
    revalidatePath("/admin")
    revalidatePath("/admin/fleet")
    revalidatePath("/")

    return { success: true, carId }
  } catch (error) {
    console.error("Error adding car:", error)
    throw new Error("Failed to add car")
  }
} 