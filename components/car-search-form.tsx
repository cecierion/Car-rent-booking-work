"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format, addDays } from "date-fns"
import type { Location } from "@/lib/data-context"

interface CarSearchFormProps {
  onSearch?: (location: string, pickupDate: Date, returnDate: Date) => void
  locations: Location[]
}

export function CarSearchForm({ onSearch, locations }: CarSearchFormProps) {
  const router = useRouter()
  const [location, setLocation] = useState("any")
  const [pickupDate, setPickupDate] = useState<Date>(new Date())
  const [returnDate, setReturnDate] = useState<Date>(addDays(new Date(), 3))

  const handleSearch = () => {
    if (onSearch) {
      // Pass empty string if "any" is selected
      onSearch(location === "any" ? "" : location, pickupDate, returnDate)
      // Scroll to the cars section
      const carsSection = document.getElementById("cars")
      if (carsSection) {
        carsSection.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      // Navigate to search results page with query parameters
      const searchParams = new URLSearchParams()
      if (location && location !== "any") searchParams.set("location", location)
      searchParams.set("pickupDate", pickupDate.toISOString())
      searchParams.set("returnDate", returnDate.toISOString())

      router.push(`/search?${searchParams.toString()}`)
    }
  }

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white/10 backdrop-blur-sm p-4 shadow-lg">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-white mb-1">
            Pickup Location
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location" className="bg-white/20 border-0 text-white">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Location</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="pickup-date" className="block text-sm font-medium text-white mb-1">
            Pickup Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="pickup-date"
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white/20 border-0 text-white"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(pickupDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={pickupDate}
                onSelect={(date) => date && setPickupDate(date)}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label htmlFor="return-date" className="block text-sm font-medium text-white mb-1">
            Return Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="return-date"
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white/20 border-0 text-white"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(returnDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={returnDate}
                onSelect={(date) => date && setReturnDate(date)}
                initialFocus
                disabled={(date) => date < pickupDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-end">
          <Button onClick={handleSearch} className="w-full bg-primary hover:bg-primary/90" size="lg">
            Search Cars
          </Button>
        </div>
      </div>
    </div>
  )
}
