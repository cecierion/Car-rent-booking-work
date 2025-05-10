export interface Car {
  id: string
  make: string
  model: string
  year: number
  transmission: string
  fuelType: string
  seats: number
  pricePerDay: number
  available: boolean
  image?: string
  description?: string
  locationId?: string
  popularity?: number // For tracking popular cars
}

export interface Booking {
  id: string
  carId: string
  customerId?: string // Link to customer
  name: string
  email: string
  phone: string
  startDate: string
  endDate: string
  totalPrice: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
  cancelReason?: string
  locationId?: string
  confirmationCode: string // Unique booking confirmation code
}

export interface BookingHistory {
  id: string
  bookingId: string
  timestamp: string
  action: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  reason?: string
  changes?: {
    [key: string]: string | { from: string; to: string }
  }
}

export interface DateRange {
  from: Date
  to: Date
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  driverLicense?: string
  dateOfBirth?: string
  joinedDate: string
  status: "active" | "inactive" | "blacklisted"
  notes?: string
  totalBookings: number
  totalSpent: number
  bookingIds: string[] // Track all bookings by this customer
}

// Notification interface for notification system
export interface Notification {
  id: string
  type: "new_booking" | "booking_update" | "booking_cancelled" | "payment" | "system" | "customer_update"
  title: string
  message: string
  timestamp: string
  read: boolean
  linkTo?: string
  relatedId?: string // ID of related booking, customer, etc.
  priority: "low" | "medium" | "high"
}

// Analytics data types
export interface MonthlyRevenueData {
  month: string
  revenue: number
}

export interface BookingStatusData {
  name: string
  value: number
}

export interface CarUtilizationData {
  name: string
  carId: string
  utilization: number
}

export interface RevenueByCarData {
  carId: string
  carName: string
  revenue: number
  bookings: number
  averageBookingValue: number
  utilization: number
}

export interface BookingTrendsData {
  month: string
  totalBookings: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  cancellationRate: number
}

export interface AnalyticsSummary {
  totalRevenue: number
  totalBookings: number
  activeBookings: number
  averageBookingValue: number
  revenueChange: number
  bookingsChange: number
  pendingBookings: number
}

export interface AnalyticsData {
  summary: AnalyticsSummary
  revenueByMonth: MonthlyRevenueData[]
  bookingsByStatus: BookingStatusData[]
  carUtilization: CarUtilizationData[]
  revenueByCar: RevenueByCarData[]
  bookingTrends: BookingTrendsData[]
}

export interface Location {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}
