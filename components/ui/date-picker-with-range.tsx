"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BookingRange {
  startDate: string | Date
  endDate: string | Date
  name?: string
}

interface DatePickerWithRangeProps {
  date?: DateRange
  onSelect?: (date: DateRange | undefined) => void
  disabled?: boolean
  className?: string
  minDate?: Date
  maxDate?: Date
  bookings?: BookingRange[]
}

export function DatePickerWithRange({
  date,
  onSelect,
  disabled,
  className,
  minDate,
  maxDate,
  bookings = [],
}: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  // Compute all unavailable dates from bookings
  const unavailableDates = React.useMemo(() => {
    const dates: Date[] = [];
    bookings.forEach(b => {
      const start = new Date(b.startDate)
      const end = new Date(b.endDate)
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d))
      }
    })
    return dates
  }, [bookings])

  // Disable logic: before minDate, after maxDate, or in unavailableDates
  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return unavailableDates.some(
      (d) => d.toDateString() === date.toDateString()
    )
  }

  // Highlight logic for unavailable dates
  const modifiers = {
    unavailable: unavailableDates,
  }
  const modifiersClassNames = {
    unavailable: "bg-red-500 text-white font-bold rounded-full opacity-80 cursor-not-allowed border-2 border-red-700",
  }

  // Helper to get booking info for a date
  const getBookingForDate = (date: Date) => {
    return bookings.find(b => {
      const start = new Date(b.startDate)
      const end = new Date(b.endDate)
      return date >= start && date <= end
    })
  }

  // Custom renderDay function
  const renderDay = (date: Date) => {
    const booking = getBookingForDate(date)
    if (booking) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>{date.getDate()}</div>
            </TooltipTrigger>
            <TooltipContent>
              Booked{booking.name ? `: ${booking.name}` : ""}
              <br />
              {format(new Date(booking.startDate), "MMM d, yyyy")} - {format(new Date(booking.endDate), "MMM d, yyyy")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }
    return <div>{date.getDate()}</div>
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => {
              onSelect?.(range);
              if (range?.from && range?.to) {
                setIsOpen(false);
              }
            }}
            numberOfMonths={2}
            disabled={isDateDisabled}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            renderDay={renderDay}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
} 