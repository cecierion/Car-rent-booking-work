"use client"

import { useState } from "react"
import { format, addDays, subDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { AvailabilityTimeline } from "./availability-timeline"
import { AvailabilityStats } from "./availability-stats"
import type { Car, Booking, Location } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Download, Calendar as CalendarIcon, ChevronDown, BarChart2, PieChart, LineChart } from "lucide-react"
import { AvailabilityCharts } from "./availability-charts"

interface FleetAvailabilityViewProps {
    cars: Car[]
    bookings: Booking[]
    locations: Location[]
}

type SortField = "price" | "availability" | "year" | "seats"
type SortOrder = "asc" | "desc"
type ViewMode = "timeline" | "calendar" | "heatmap" | "chart"

export function FleetAvailabilityView({ cars, bookings, locations }: FleetAvailabilityViewProps) {
    const [dateRange, setDateRange] = useState({
        start: new Date(),
        end: addDays(new Date(), 14),
    })
    const [filters, setFilters] = useState({
        search: "",
        location: "all",
        transmission: "all",
        fuelType: "all",
        minPrice: "",
        maxPrice: "",
        minSeats: "",
        maxSeats: "",
        carType: "all",
    })
    const [sortConfig, setSortConfig] = useState<{ field: SortField; order: SortOrder }>({
        field: "availability",
        order: "desc",
    })
    const [viewMode, setViewMode] = useState<ViewMode>("timeline")
    const [selectedCars, setSelectedCars] = useState<Set<string>>(new Set())
    const [batchAction, setBatchAction] = useState<"price" | "location" | "status">("price")
    const [batchValue, setBatchValue] = useState("")

    const handleDateRangeChange = (days: number) => {
        setDateRange({
            start: subDays(dateRange.start, days),
            end: addDays(dateRange.end, days),
        })
    }

    const handleSort = (field: SortField) => {
        setSortConfig((prev) => ({
            field,
            order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
        }))
    }

    const handleExport = () => {
        const data = filteredCars.map((car) => {
            const availability = getCarAvailability(car)
            return {
                "Car": `${car.make} ${car.model} (${car.year})`,
                "Location": locations.find((loc) => loc.id === car.locationId)?.name,
                "Transmission": car.transmission,
                "Fuel Type": car.fuelType,
                "Seats": car.seats,
                "Price/Day": car.pricePerDay,
                "Availability %": availability.availability.toFixed(1),
                "Total Days": availability.totalDays,
                "Booked Days": availability.bookedDays,
            }
        })

        const csv = [
            Object.keys(data[0]).join(","),
            ...data.map((row) => Object.values(row).join(",")),
        ].join("\n")

        const blob = new Blob([csv], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `fleet-availability-${format(new Date(), "yyyy-MM-dd")}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    const handleBatchAction = () => {
        // Here you would implement the actual batch action logic
        // For now, we'll just log the action
        console.log("Batch action:", {
            action: batchAction,
            value: batchValue,
            cars: Array.from(selectedCars),
        })
        setSelectedCars(new Set())
        setBatchValue("")
    }

    const filteredCars = cars
        .filter((car) => {
            const carBookings = bookings.filter((booking) => booking.carId === car.id)
            const location = locations.find((loc) => loc.id === car.locationId)

            // Search filter
            const searchMatch =
                !filters.search ||
                car.make.toLowerCase().includes(filters.search.toLowerCase()) ||
                car.model.toLowerCase().includes(filters.search.toLowerCase()) ||
                car.year.toString().includes(filters.search)

            // Location filter
            const locationMatch = filters.location === "all" || car.locationId === filters.location

            // Transmission filter
            const transmissionMatch = filters.transmission === "all" || car.transmission === filters.transmission

            // Fuel type filter
            const fuelTypeMatch = filters.fuelType === "all" || car.fuelType === filters.fuelType

            // Price filters
            const priceMatch =
                (!filters.minPrice || car.pricePerDay >= parseFloat(filters.minPrice)) &&
                (!filters.maxPrice || car.pricePerDay <= parseFloat(filters.maxPrice))

            // Seats filters
            const seatsMatch =
                (!filters.minSeats || car.seats >= parseInt(filters.minSeats)) &&
                (!filters.maxSeats || car.seats <= parseInt(filters.maxSeats))

            // Car type filter
            const carTypeMatch = filters.carType === "all" || car.type === filters.carType

            return searchMatch && locationMatch && transmissionMatch && fuelTypeMatch && priceMatch && seatsMatch && carTypeMatch
        })
        .sort((a, b) => {
            const aValue = sortConfig.field === "availability"
                ? getCarAvailability(a).availability
                : a[sortConfig.field]
            const bValue = sortConfig.field === "availability"
                ? getCarAvailability(b).availability
                : b[sortConfig.field]

            if (sortConfig.order === "asc") {
                return aValue > bValue ? 1 : -1
            }
            return aValue < bValue ? 1 : -1
        })

    const getCarAvailability = (car: Car) => {
        const carBookings = bookings.filter((booking) => booking.carId === car.id)
        const totalDays = Math.ceil(
            (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)
        )
        const bookedDays = carBookings.reduce((total, booking) => {
            const bookingStart = new Date(booking.startDate)
            const bookingEnd = new Date(booking.endDate)
            const days = Math.ceil(
                (bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60 * 60 * 24)
            )
            return total + days
        }, 0)

        return {
            totalDays,
            bookedDays,
            availability: ((totalDays - bookedDays) / totalDays) * 100,
        }
    }

    return (
        <div className="space-y-6">
            <AvailabilityStats
                cars={cars}
                bookings={bookings}
                dateRange={dateRange}
            />

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search cars..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Select
                        value={filters.location}
                        onValueChange={(value) => setFilters({ ...filters, location: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            {locations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>
                                    {location.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.transmission}
                        onValueChange={(value) => setFilters({ ...filters, transmission: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Transmission" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Transmissions</SelectItem>
                            <SelectItem value="automatic">Automatic</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="cvt">CVT</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.fuelType}
                        onValueChange={(value) => setFilters({ ...filters, fuelType: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Fuel Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Fuel Types</SelectItem>
                            <SelectItem value="gasoline">Gasoline</SelectItem>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="electric">Electric</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.carType}
                        onValueChange={(value) => setFilters({ ...filters, carType: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Car Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="sedan">Sedan</SelectItem>
                            <SelectItem value="suv">SUV</SelectItem>
                            <SelectItem value="hatchback">Hatchback</SelectItem>
                            <SelectItem value="coupe">Coupe</SelectItem>
                            <SelectItem value="convertible">Convertible</SelectItem>
                            <SelectItem value="wagon">Wagon</SelectItem>
                            <SelectItem value="van">Van</SelectItem>
                            <SelectItem value="pickup">Pickup</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex gap-2">
                    <Input
                        type="number"
                        placeholder="Min Price"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                    <Input
                        type="number"
                        placeholder="Max Price"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />
                </div>

                <div className="flex gap-2">
                    <Input
                        type="number"
                        placeholder="Min Seats"
                        value={filters.minSeats}
                        onChange={(e) => setFilters({ ...filters, minSeats: e.target.value })}
                    />
                    <Input
                        type="number"
                        placeholder="Max Seats"
                        value={filters.maxSeats}
                        onChange={(e) => setFilters({ ...filters, maxSeats: e.target.value })}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full">
                                Sort by: {sortConfig.field}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleSort("price")}>
                                Price {sortConfig.field === "price" && (sortConfig.order === "asc" ? "↑" : "↓")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSort("availability")}>
                                Availability {sortConfig.field === "availability" && (sortConfig.order === "asc" ? "↑" : "↓")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSort("year")}>
                                Year {sortConfig.field === "year" && (sortConfig.order === "asc" ? "↑" : "↓")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSort("seats")}>
                                Seats {sortConfig.field === "seats" && (sortConfig.order === "asc" ? "↑" : "↓")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDateRangeChange(-7)}
                    >
                        Previous Week
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDateRangeChange(7)}
                    >
                        Next Week
                    </Button>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant={viewMode === "timeline" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("timeline")}
                    >
                        Timeline
                    </Button>
                    <Button
                        variant={viewMode === "calendar" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("calendar")}
                    >
                        Calendar
                    </Button>
                    <Button
                        variant={viewMode === "heatmap" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("heatmap")}
                    >
                        Heatmap
                    </Button>
                    <Button
                        variant={viewMode === "chart" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("chart")}
                    >
                        Chart
                    </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                    {format(dateRange.start, "MMM d")} - {format(dateRange.end, "MMM d, yyyy")}
                </div>
            </div>

            {selectedCars.size > 0 && (
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="text-sm font-medium">
                        {selectedCars.size} cars selected
                    </div>
                    <Select
                        value={batchAction}
                        onValueChange={(value: "price" | "location" | "status") => setBatchAction(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="price">Update Price</SelectItem>
                            <SelectItem value="location">Change Location</SelectItem>
                            <SelectItem value="status">Update Status</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Enter value"
                        value={batchValue}
                        onChange={(e) => setBatchValue(e.target.value)}
                        className="w-[180px]"
                    />
                    <Button onClick={handleBatchAction}>Apply</Button>
                    <Button variant="outline" onClick={() => setSelectedCars(new Set())}>
                        Cancel
                    </Button>
                </div>
            )}

            <div className="grid gap-4">
                {filteredCars.map((car) => {
                    const carBookings = bookings.filter((booking) => booking.carId === car.id)
                    const location = locations.find((loc) => loc.id === car.locationId)
                    const availability = getCarAvailability(car)

                    return (
                        <Card key={car.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Checkbox
                                            checked={selectedCars.has(car.id)}
                                            onCheckedChange={(checked) => {
                                                const newSelected = new Set(selectedCars)
                                                if (checked) {
                                                    newSelected.add(car.id)
                                                } else {
                                                    newSelected.delete(car.id)
                                                }
                                                setSelectedCars(newSelected)
                                            }}
                                        />
                                        <div className="space-y-1">
                                            <div className="text-lg">
                                                {car.make} {car.model} ({car.year})
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {location?.name} • {car.transmission} • {car.fuelType} • {car.seats} seats
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-medium">${car.pricePerDay}/day</div>
                                        <div
                                            className={cn(
                                                "text-sm",
                                                availability.availability > 75
                                                    ? "text-green-600"
                                                    : availability.availability > 25
                                                        ? "text-yellow-600"
                                                        : "text-red-600"
                                            )}
                                        >
                                            {availability.availability.toFixed(1)}% available
                                        </div>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {viewMode === "timeline" ? (
                                    <AvailabilityTimeline
                                        bookings={carBookings}
                                        startDate={dateRange.start}
                                        endDate={dateRange.end}
                                    />
                                ) : viewMode === "calendar" ? (
                                    <Calendar
                                        mode="range"
                                        selected={{
                                            from: dateRange.start,
                                            to: dateRange.end,
                                        }}
                                        disabled={(date) => {
                                            return carBookings.some((booking) => {
                                                const bookingStart = new Date(booking.startDate)
                                                const bookingEnd = new Date(booking.endDate)
                                                return date >= bookingStart && date <= bookingEnd
                                            })
                                        }}
                                        className="rounded-md border"
                                    />
                                ) : viewMode === "heatmap" ? (
                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({ length: 7 }, (_, i) => {
                                            const date = addDays(dateRange.start, i)
                                            const isBooked = carBookings.some((booking) => {
                                                const bookingStart = new Date(booking.startDate)
                                                const bookingEnd = new Date(booking.endDate)
                                                return date >= bookingStart && date <= bookingEnd
                                            })
                                            return (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "h-8 rounded-sm flex items-center justify-center text-xs",
                                                        isBooked ? "bg-red-500 text-white" : "bg-green-500 text-white"
                                                    )}
                                                >
                                                    {format(date, "EEE")}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <AvailabilityCharts
                                        cars={cars}
                                        bookings={bookings}
                                        dateRange={dateRange}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
} 