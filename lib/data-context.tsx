"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { carsData, bookingsData, customersData, locationsData } from "@/lib/data"
import type { Car, Booking, Customer, Location } from "@/lib/types"

interface CustomerData {
  name: string
  email: string
  phone: string
  bookingId: string
  totalSpent: number
}

interface DataContextType {
  cars: Car[]
  setCars: (cars: Car[]) => void
  bookings: Booking[]
  setBookings: (bookings: Booking[]) => void
  locations: Location[]
  setLocations: (locations: Location[]) => void
  customers: Customer[]
  setCustomers: (customers: Customer[]) => void
  addCar: (car: Omit<Car, "id">) => void
  updateCar: (car: Car) => void
  deleteCar: (id: string) => void
  addBooking: (booking: Booking) => void
  updateBooking: (booking: Booking) => void
  deleteBooking: (id: string) => void
  addLocation: (location: Omit<Location, "id">) => void
  updateLocation: (location: Location) => void
  deleteLocation: (id: string) => void
  addOrUpdateCustomer: (customerData: CustomerData) => void
  updateCustomer: (customer: Customer) => void
  deleteCustomer: (id: string) => void
}

// Update cars with location IDs - ensure carsData is an array before mapping
const carsWithLocations = Array.isArray(carsData)
  ? carsData.map((car, index) => ({
      ...car,
      locationId:
        Array.isArray(locationsData) && locationsData.length > 0
          ? locationsData[index % locationsData.length].id
          : "loc1",
    }))
  : []

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [cars, setCars] = useState<Car[]>(carsWithLocations)
  const [bookings, setBookings] = useState<Booking[]>(Array.isArray(bookingsData) ? bookingsData : [])
  const [locations, setLocations] = useState<Location[]>(Array.isArray(locationsData) ? locationsData : [])
  const [customers, setCustomers] = useState<Customer[]>(Array.isArray(customersData) ? customersData : [])

  // Load data from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCars = localStorage.getItem("car_rental_cars")
      const storedBookings = localStorage.getItem("car_rental_bookings")
      const storedLocations = localStorage.getItem("car_rental_locations")
      const storedCustomers = localStorage.getItem("car_rental_customers")

      if (storedCars) setCars(JSON.parse(storedCars))
      if (storedBookings) setBookings(JSON.parse(storedBookings))
      if (storedLocations) setLocations(JSON.parse(storedLocations))
      if (storedCustomers) setCustomers(JSON.parse(storedCustomers))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("car_rental_cars", JSON.stringify(cars))
      localStorage.setItem("car_rental_bookings", JSON.stringify(bookings))
      localStorage.setItem("car_rental_locations", JSON.stringify(locations))
      localStorage.setItem("car_rental_customers", JSON.stringify(customers))
    }
  }, [cars, bookings, locations, customers])

  const addCar = (carData: Omit<Car, "id">) => {
    const newCar: Car = {
      ...carData,
      id: `car-${Date.now()}`,
    }
    setCars((prevCars) => [...prevCars, newCar])
  }

  const updateCar = (car: Car) => {
    setCars((prevCars) => prevCars.map((c) => (c.id === car.id ? car : c)))
  }

  const deleteCar = (id: string) => {
    setCars((prevCars) => prevCars.filter((car) => car.id !== id))
  }

  const addBooking = (booking: Booking) => {
    setBookings((prevBookings) => [booking, ...prevBookings])
  }

  const updateBooking = (booking: Booking) => {
    setBookings((prevBookings) => prevBookings.map((b) => (b.id === booking.id ? booking : b)))
  }

  const deleteBooking = (id: string) => {
    setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id))
  }

  const addLocation = (locationData: Omit<Location, "id">) => {
    const newLocation: Location = {
      ...locationData,
      id: `loc-${Date.now()}`,
    }
    setLocations((prevLocations) => [...prevLocations, newLocation])
  }

  const updateLocation = (location: Location) => {
    setLocations((prevLocations) => prevLocations.map((l) => (l.id === location.id ? location : l)))
  }

  const deleteLocation = (id: string) => {
    // Check if any cars are using this location
    const carsUsingLocation = cars.some((car) => car.locationId === id)

    if (carsUsingLocation) {
      alert("Cannot delete location because it is being used by one or more cars")
      return
    }

    setLocations((prevLocations) => prevLocations.filter((location) => location.id !== id))
  }

  const addOrUpdateCustomer = (customerData: CustomerData) => {
    // Check if customer already exists by email
    const existingCustomer = customers.find((c) => c.email === customerData.email)

    if (existingCustomer) {
      // Update existing customer
      const updatedCustomer: Customer = {
        ...existingCustomer,
        name: customerData.name, // Update name in case it changed
        phone: customerData.phone, // Update phone in case it changed
        totalBookings: existingCustomer.totalBookings + 1,
        totalSpent: existingCustomer.totalSpent + customerData.totalSpent,
        bookingIds: [...existingCustomer.bookingIds, customerData.bookingId],
      }
      setCustomers((prevCustomers) => prevCustomers.map((c) => (c.id === existingCustomer.id ? updatedCustomer : c)))
    } else {
      // Create new customer
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        joinedDate: new Date().toISOString(),
        status: "active",
        totalBookings: 1,
        totalSpent: customerData.totalSpent,
        bookingIds: [customerData.bookingId],
      }
      setCustomers((prevCustomers) => [...prevCustomers, newCustomer])
    }
  }

  const updateCustomer = (customer: Customer) => {
    setCustomers((prevCustomers) => prevCustomers.map((c) => (c.id === customer.id ? customer : c)))
  }

  const deleteCustomer = (id: string) => {
    setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.id !== id))
  }

  return (
    <DataContext.Provider
      value={{
        cars,
        setCars,
        bookings,
        setBookings,
        locations,
        setLocations,
        customers,
        setCustomers,
        addCar,
        updateCar,
        deleteCar,
        addBooking,
        updateBooking,
        deleteBooking,
        addLocation,
        updateLocation,
        deleteLocation,
        addOrUpdateCustomer,
        updateCustomer,
        deleteCustomer,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
