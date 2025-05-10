import type { Booking, Car, Customer, Location, Notification } from "@/lib/types"

// Sample cars data
export const carsData: Car[] = [
  {
    id: "car-1",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    transmission: "Automatic",
    fuelType: "Gasoline",
    seats: 5,
    pricePerDay: 50,
    image: "/placeholder.svg?height=200&width=300",
    description: "Comfortable and reliable sedan, perfect for city driving.",
    available: true,
    color: "Silver",
    licensePlate: "ABC123",
  },
  {
    id: "car-2",
    make: "Honda",
    model: "CR-V",
    year: 2023,
    transmission: "Automatic",
    fuelType: "Gasoline",
    seats: 5,
    pricePerDay: 65,
    image: "/placeholder.svg?height=200&width=300",
    description: "Spacious SUV with excellent fuel economy.",
    available: true,
    color: "Blue",
    licensePlate: "DEF456",
  },
  {
    id: "car-3",
    make: "Ford",
    model: "Mustang",
    year: 2022,
    transmission: "Automatic",
    fuelType: "Gasoline",
    seats: 4,
    pricePerDay: 85,
    image: "/placeholder.svg?height=200&width=300",
    description: "Iconic sports car with powerful performance.",
    available: true,
    color: "Red",
    licensePlate: "GHI789",
  },
  {
    id: "car-4",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    transmission: "Automatic",
    fuelType: "Electric",
    seats: 5,
    pricePerDay: 95,
    image: "/placeholder.svg?height=200&width=300",
    description: "Electric sedan with advanced technology.",
    available: true,
    color: "White",
    licensePlate: "JKL012",
  },
  {
    id: "car-5",
    make: "BMW",
    model: "X5",
    year: 2023,
    transmission: "Automatic",
    fuelType: "Gasoline",
    seats: 5,
    pricePerDay: 120,
    image: "/placeholder.svg?height=200&width=300",
    description: "Luxury SUV with premium features.",
    available: true,
    color: "Black",
    licensePlate: "MNO345",
  },
  {
    id: "car-6",
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2022,
    transmission: "Automatic",
    fuelType: "Gasoline",
    seats: 5,
    pricePerDay: 110,
    image: "/placeholder.svg?height=200&width=300",
    description: "Luxury sedan with elegant design.",
    available: true,
    color: "Gray",
    licensePlate: "PQR678",
  },
]

// Sample locations data
export const locationsData: Location[] = [
  {
    id: "loc1",
    name: "Downtown Office",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    phone: "212-555-1234",
    email: "downtown@carrentalexample.com",
    hours: "Mon-Fri: 8am-8pm, Sat-Sun: 9am-5pm",
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: "loc2",
    name: "Airport Terminal",
    address: "JFK Airport, Terminal 4",
    city: "Jamaica",
    state: "NY",
    zipCode: "11430",
    phone: "212-555-5678",
    email: "airport@carrentalexample.com",
    hours: "24/7",
    coordinates: { lat: 40.6413, lng: -73.7781 },
  },
  {
    id: "loc3",
    name: "Uptown Branch",
    address: "456 Park Ave",
    city: "New York",
    state: "NY",
    zipCode: "10022",
    phone: "212-555-9012",
    email: "uptown@carrentalexample.com",
    hours: "Mon-Fri: 9am-7pm, Sat: 10am-4pm, Sun: Closed",
    coordinates: { lat: 40.7624, lng: -73.9738 },
  },
]

// Sample booking data
export const bookingsData: Booking[] = [
  {
    id: "booking1",
    carId: "car-1",
    customerId: "cust1",
    name: "John Doe",
    email: "john@example.com",
    phone: "555-123-4567",
    startDate: "2023-07-15T10:00:00.000Z",
    endDate: "2023-07-20T10:00:00.000Z",
    totalPrice: 325,
    status: "completed",
    createdAt: "2023-07-10T08:30:00.000Z",
    locationId: "loc1",
  },
  {
    id: "booking2",
    carId: "car-2",
    customerId: "cust2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "555-987-6543",
    startDate: "2023-08-01T14:00:00.000Z",
    endDate: "2023-08-05T14:00:00.000Z",
    totalPrice: 400,
    status: "confirmed",
    createdAt: "2023-07-25T11:00:00.000Z",
    locationId: "loc2",
  },
  {
    id: "booking-test-1",
    carId: "car-1",
    customerId: "test-cust",
    name: "Test User",
    email: "testuser@example.com",
    phone: "555-000-0000",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    totalPrice: 200,
    status: "pending",
    createdAt: new Date().toISOString(),
    locationId: "loc1",
  },
]

// Sample customer data
export const customersData: Customer[] = [
  {
    id: "cust1",
    name: "John Doe",
    email: "john@example.com",
    phone: "555-123-4567",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    joinedDate: "2023-01-01T00:00:00.000Z",
    status: "active",
    totalBookings: 1,
    totalSpent: 325,
    bookingIds: ["booking1"],
  },
  {
    id: "cust2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "555-987-6543",
    address: "456 Park Ave",
    city: "Boston",
    state: "MA",
    zipCode: "02108",
    country: "USA",
    joinedDate: "2023-02-15T00:00:00.000Z",
    status: "active",
    totalBookings: 1,
    totalSpent: 400,
    bookingIds: ["booking2"],
  },
]

// Sample notification data
export const notificationsData: Notification[] = [
  {
    id: "notif1",
    type: "new_booking",
    title: "New Booking",
    message: "John Doe has booked a Toyota Camry for Jul 15 - Jul 20",
    timestamp: "2023-07-10T08:30:00.000Z",
    read: false,
    relatedId: "booking1",
    priority: "medium",
  },
  {
    id: "notif-2",
    type: "booking_update",
    title: "Booking Completed",
    message: "Booking #booking1 has been marked as completed",
    timestamp: "2023-05-16T14:20:00.000Z",
    read: true,
    linkTo: "/admin?booking=booking1",
    relatedId: "booking1",
    priority: "low",
  },
  {
    id: "notif-3",
    type: "new_booking",
    title: "New Booking",
    message: "Jane Smith has booked a Honda CR-V for Aug 1-5",
    timestamp: "2023-07-25T11:00:00.000Z",
    read: false,
    linkTo: "/admin?booking=booking2",
    relatedId: "booking2",
    priority: "medium",
  },
]

// Server actions with individual "use server" directives
export async function getCars(): Promise<Car[]> {
  return [...carsData]
}

export async function getCar(id: string): Promise<Car | null> {
  return carsData.find((car) => car.id === id) || null
}

export async function getLocations(): Promise<Location[]> {
  return [...locationsData]
}

export async function getLocation(id: string): Promise<Location | null> {
  return locationsData.find((location) => location.id === id) || null
}

export async function getBookings(): Promise<Booking[]> {
  return [...bookingsData]
}

export async function getBooking(id: string): Promise<Booking | null> {
  return bookingsData.find((booking) => booking.id === id) || null
}

export async function getCustomers(): Promise<Customer[]> {
  return [...customersData]
}

export async function getCustomer(id: string): Promise<Customer | null> {
  return customersData.find((customer) => customer.id === id) || null
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  return customersData.find((customer) => customer.email === email) || null
}

export async function getBookingsForCustomer(customerId: string): Promise<Booking[]> {
  const customer = await getCustomer(customerId)
  if (!customer) return []
  return bookingsData.filter((booking) => booking.customerId === customerId)
}

export async function getBookingsForCar(carId: string): Promise<Booking[]> {
  return bookingsData.filter((booking) => booking.carId === carId)
}

export async function getBookingsForLocation(locationId: string): Promise<Booking[]> {
  return bookingsData.filter((booking) => booking.locationId === locationId)
}

export async function isCarAvailable(carId: string, startDate: string, endDate: string): Promise<boolean> {
  const car = await getCar(carId)
  if (!car || !car.available) return false
  // Add logic to check if the car is available for the given date range
  return true
}

export async function getAvailableCars(startDate: string, endDate: string): Promise<Car[]> {
  const cars = await getCars()
  const availableCars: Car[] = []
  for (const car of cars) {
    if (await isCarAvailable(car.id, startDate, endDate)) {
      availableCars.push(car)
    }
  }
  return availableCars
}

export async function getBookingHistoryForCar(carId: string): Promise<Booking[]> {
  return bookingsData.filter((booking) => booking.carId === carId)
}

export async function getNotifications(): Promise<Notification[]> {
  return [...notificationsData]
}

export async function getUnreadNotificationsCount(): Promise<number> {
  return notificationsData.filter((notification) => !notification.read).length
}

export async function getHighPriorityNotifications(): Promise<Notification[]> {
  return notificationsData.filter((notification) => notification.priority === "high")
}

export async function getRecentNotifications(count = 5): Promise<Notification[]> {
  return [...notificationsData]
    .sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
    .slice(0, count)
}

export async function bookCar(bookingData: any) {
  // This is a placeholder function
  return {
    success: true,
    bookingId: "sample-booking-id",
    status: "confirmed",
  }
}

export async function sendConfirmationEmail(bookingId: string) {
  // This is a placeholder function
  return {
    success: true,
  }
}

export async function getSampleBooking(): Promise<Booking> {
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

export async function getSampleCustomer(): Promise<Customer> {
  return {
    id: "sample-customer",
    name: "Sample Customer",
    email: "sample@example.com",
    phone: "123-456-7890",
    bookingId: "sample-booking",
    totalSpent: 700,
  }
}
