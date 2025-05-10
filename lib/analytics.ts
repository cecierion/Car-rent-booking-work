import type {
  Booking,
  Car,
  DateRange,
  AnalyticsData,
  MonthlyRevenueData,
  BookingStatusData,
  CarUtilizationData,
  RevenueByCarData,
  BookingTrendsData,
} from "./types"
import {
  format,
  isWithinInterval,
  parseISO,
  differenceInDays,
  differenceInMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
} from "date-fns"

// Main function to calculate all analytics data
export function calculateAnalyticsData(bookings: Booking[], cars: Car[], dateRange: DateRange): AnalyticsData {
  // Filter bookings within the date range
  const filteredBookings = bookings.filter((booking) => {
    const bookingStart = parseISO(booking.startDate)
    return isWithinInterval(bookingStart, { start: dateRange.from, end: dateRange.to })
  })

  // Calculate previous period for comparison
  const periodLengthMonths = differenceInMonths(dateRange.to, dateRange.from) || 1
  const previousPeriodEnd = subMonths(dateRange.from, 1)
  const previousPeriodStart = subMonths(previousPeriodEnd, periodLengthMonths)

  // Filter bookings for previous period
  const previousPeriodBookings = bookings.filter((booking) => {
    const bookingStart = parseISO(booking.startDate)
    return isWithinInterval(bookingStart, { start: previousPeriodStart, end: previousPeriodEnd })
  })

  // Calculate summary metrics
  const totalRevenue = filteredBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
  const previousTotalRevenue = previousPeriodBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)

  const revenueChange =
    previousTotalRevenue === 0 ? 100 : Math.round(((totalRevenue - previousTotalRevenue) / previousTotalRevenue) * 100)

  const bookingsChange =
    previousPeriodBookings.length === 0
      ? 100
      : Math.round(((filteredBookings.length - previousPeriodBookings.length) / previousPeriodBookings.length) * 100)

  const activeBookings = filteredBookings.filter((booking) => booking.status === "confirmed").length
  const pendingBookings = filteredBookings.filter((booking) => booking.status === "pending").length
  const averageBookingValue = filteredBookings.length === 0 ? 0 : Math.round(totalRevenue / filteredBookings.length)

  // Generate monthly revenue data
  const revenueByMonth = calculateMonthlyRevenue(filteredBookings, dateRange)

  // Calculate booking status distribution
  const bookingsByStatus = calculateBookingStatusDistribution(filteredBookings)

  // Calculate car utilization
  const carUtilization = calculateCarUtilization(bookings, cars, dateRange)

  // Calculate revenue by car
  const revenueByCar = calculateRevenueByCar(filteredBookings, cars)

  // Calculate booking trends
  const bookingTrends = calculateBookingTrends(bookings, dateRange)

  return {
    summary: {
      totalRevenue,
      totalBookings: filteredBookings.length,
      activeBookings,
      averageBookingValue,
      revenueChange,
      bookingsChange,
      pendingBookings,
    },
    revenueByMonth,
    bookingsByStatus,
    carUtilization,
    revenueByCar,
    bookingTrends,
  }
}

// Calculate monthly revenue
function calculateMonthlyRevenue(bookings: Booking[], dateRange: DateRange): MonthlyRevenueData[] {
  // Get all months in the date range
  const months = eachMonthOfInterval({
    start: dateRange.from,
    end: dateRange.to,
  })

  return months.map((month) => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)

    // Filter bookings for this month
    const monthlyBookings = bookings.filter((booking) => {
      const bookingStart = parseISO(booking.startDate)
      return isWithinInterval(bookingStart, { start: monthStart, end: monthEnd })
    })

    // Calculate total revenue for the month
    const revenue = monthlyBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)

    return {
      month: format(month, "MMM yyyy"),
      revenue,
    }
  })
}

// Calculate booking status distribution
function calculateBookingStatusDistribution(bookings: Booking[]): BookingStatusData[] {
  const pending = bookings.filter((booking) => booking.status === "pending").length
  const confirmed = bookings.filter((booking) => booking.status === "confirmed").length
  const completed = bookings.filter((booking) => booking.status === "completed").length
  const cancelled = bookings.filter((booking) => booking.status === "cancelled").length

  return [
    { name: "Pending", value: pending },
    { name: "Confirmed", value: confirmed },
    { name: "Completed", value: completed },
    { name: "Cancelled", value: cancelled },
  ]
}

// Calculate car utilization
function calculateCarUtilization(bookings: Booking[], cars: Car[], dateRange: DateRange): CarUtilizationData[] {
  const totalDays = differenceInDays(dateRange.to, dateRange.from) + 1

  return cars.map((car) => {
    // Get all bookings for this car in the date range
    const carBookings = bookings.filter((booking) => {
      const bookingStart = parseISO(booking.startDate)
      const bookingEnd = parseISO(booking.endDate)

      // Check if booking overlaps with date range
      return (
        booking.carId === car.id &&
        (isWithinInterval(bookingStart, { start: dateRange.from, end: dateRange.to }) ||
          isWithinInterval(bookingEnd, { start: dateRange.from, end: dateRange.to }) ||
          (bookingStart <= dateRange.from && bookingEnd >= dateRange.to))
      )
    })

    // Calculate total days the car was booked
    let bookedDays = 0
    carBookings.forEach((booking) => {
      // Only count confirmed and completed bookings for utilization
      if (booking.status === "confirmed" || booking.status === "completed") {
        const bookingStart = parseISO(booking.startDate)
        const bookingEnd = parseISO(booking.endDate)

        // Calculate overlap with date range
        const overlapStart = bookingStart < dateRange.from ? dateRange.from : bookingStart
        const overlapEnd = bookingEnd > dateRange.to ? dateRange.to : bookingEnd
        const daysBooked = Math.max(0, differenceInDays(overlapEnd, overlapStart) + 1)

        bookedDays += daysBooked
      }
    })

    // Calculate utilization percentage
    const utilization = Math.round((bookedDays / totalDays) * 100)

    return {
      name: `${car.make} ${car.model}`,
      carId: car.id,
      utilization,
    }
  })
}

// Calculate revenue by car
function calculateRevenueByCar(bookings: Booking[], cars: Car[]): RevenueByCarData[] {
  return cars
    .map((car) => {
      // Get all bookings for this car
      const carBookings = bookings.filter((booking) => booking.carId === car.id)

      // Calculate total revenue (only from confirmed and completed bookings)
      const revenue = carBookings
        .filter((booking) => booking.status === "confirmed" || booking.status === "completed")
        .reduce((sum, booking) => sum + booking.totalPrice, 0)

      // Calculate average booking value
      const completedBookings = carBookings.filter(
        (booking) => booking.status === "confirmed" || booking.status === "completed",
      )
      const averageBookingValue = completedBookings.length === 0 ? 0 : Math.round(revenue / completedBookings.length)

      // Calculate utilization (percentage of bookings)
      const utilization = bookings.length === 0 ? 0 : Math.round((carBookings.length / bookings.length) * 100)

      return {
        carId: car.id,
        carName: `${car.make} ${car.model}`,
        revenue,
        bookings: carBookings.length,
        averageBookingValue,
        utilization,
      }
    })
    .filter((car) => car.bookings > 0) // Only include cars with bookings
}

// Calculate booking trends
function calculateBookingTrends(bookings: Booking[], dateRange: DateRange): BookingTrendsData[] {
  // Get all months in the date range
  const months = eachMonthOfInterval({
    start: dateRange.from,
    end: dateRange.to,
  })

  return months.map((month) => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)

    // Filter bookings for this month
    const monthlyBookings = bookings.filter((booking) => {
      const bookingStart = parseISO(booking.startDate)
      return isWithinInterval(bookingStart, { start: monthStart, end: monthEnd })
    })

    // Count bookings by status
    const pending = monthlyBookings.filter((booking) => booking.status === "pending").length
    const confirmed = monthlyBookings.filter((booking) => booking.status === "confirmed").length
    const completed = monthlyBookings.filter((booking) => booking.status === "completed").length
    const cancelled = monthlyBookings.filter((booking) => booking.status === "cancelled").length
    const totalBookings = monthlyBookings.length

    // Calculate cancellation rate
    const cancellationRate = totalBookings === 0 ? 0 : Math.round((cancelled / totalBookings) * 100)

    return {
      month: format(month, "MMM yyyy"),
      totalBookings,
      pending,
      confirmed,
      completed,
      cancelled,
      cancellationRate,
    }
  })
}
