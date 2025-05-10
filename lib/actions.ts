"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCar } from "./server-actions"
import type { Booking, Car, Location, Notification } from "@/lib/types"

// Mock data store for notifications (in a real app, this would be in a database)
export const notificationsData: Notification[] = []

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
      type: "booking_update",
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
    notificationsData = []
    revalidatePath("/admin")
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
    const notification = notificationsData.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
    revalidatePath("/admin")
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
    notificationsData.forEach((notification) => {
      notification.read = true
    })
    revalidatePath("/admin")
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
    notificationsData = notificationsData.filter((n) => n.id !== notificationId)
    revalidatePath("/admin")
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
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: type as any,
      title: `Test ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      message: `This is a test ${type} notification`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "low",
    }

    notificationsData.unshift(newNotification)
    revalidatePath("/admin")
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
      message: `Customer #${customerId} has been updated`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "low",
    }

    notificationsData.unshift(newNotification)

    // Revalidate paths
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
      type: "customer_delete",
      title: "Customer Deleted",
      message: `Customer #${customerId} has been deleted`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "medium",
    }

    notificationsData.unshift(newNotification)

    // Revalidate paths
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
    // In a real app, you would add the customer to your database
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate a customer ID
    const customerId = `customer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    // Create a notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: "new_customer",
      title: "New Customer",
      message: `New customer ${formData.get("firstName")} ${formData.get("lastName")} has been added`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "low",
    }

    notificationsData.unshift(newNotification)

    // Revalidate paths
    revalidatePath("/admin/customers")

    return { success: true, customerId }
  } catch (error) {
    console.error("Error adding customer:", error)
    throw new Error("Failed to add customer")
  }
}
