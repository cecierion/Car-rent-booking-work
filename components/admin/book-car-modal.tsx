import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { toast } from "@/components/ui/use-toast"
import type { Car, Location, Booking } from "@/lib/types"
import { addDays, addMonths } from "date-fns"

export function BookCarModal({ isOpen, onClose, cars, locations, onBook, bookings = [], initialDateRange }) {
    const [carId, setCarId] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [locationId, setLocationId] = useState("")
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [errors, setErrors] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Filter bookings for the selected car
    const carBookings = bookings.filter(b => b.carId === carId)

    // Set date range from initialDateRange when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialDateRange && initialDateRange.from && initialDateRange.to) {
                setStartDate(initialDateRange.from)
                setEndDate(initialDateRange.to)
            } else {
                const today = new Date()
                setStartDate(today)
                setEndDate(addDays(today, 1))
            }
        }
    }, [isOpen, initialDateRange])

    const validate = () => {
        const errs = []
        if (!carId) errs.push("Car is required.")
        if (!locationId) errs.push("Location is required.")
        if (!name) errs.push("Customer name is required.")
        if (!email) errs.push("Email is required.")
        if (!phone) errs.push("Phone is required.")
        if (!startDate) errs.push("Start date is required.")
        if (!endDate) errs.push("End date is required.")
        if (startDate && endDate && endDate < startDate) errs.push("End date cannot be before start date.")
        return errs
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors([])
        const errs = validate()
        if (errs.length > 0) {
            setErrors(errs)
            toast({
                title: "Booking Error",
                description: errs.join("\n"),
                variant: "destructive",
            })
            return
        }
        setIsSubmitting(true)
        try {
            onBook({
                carId,
                name,
                email,
                phone,
                locationId,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                status: "pending",
                createdAt: new Date().toISOString(),
                totalPrice: 0,
            })
            toast({
                title: "Booking Created",
                description: `Booking for ${name} was created successfully!`,
                variant: "success",
            })
            onClose()
            // Reset form
            setCarId("")
            setName("")
            setEmail("")
            setPhone("")
            setLocationId("")
            setStartDate(null)
            setEndDate(null)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Book a Car</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.length > 0 && (
                        <div className="bg-red-100 text-red-700 rounded p-2 text-sm">
                            {errors.map((err, i) => (
                                <div key={i}>{err}</div>
                            ))}
                        </div>
                    )}
                    <Select value={carId} onValueChange={setCarId} disabled={isSubmitting}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Car" />
                        </SelectTrigger>
                        <SelectContent>
                            {cars.map((car) => (
                                <SelectItem key={car.id} value={car.id}>
                                    {car.make} {car.model}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={locationId} onValueChange={setLocationId} disabled={isSubmitting}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                        <SelectContent>
                            {locations.map((loc) => (
                                <SelectItem key={loc.id} value={loc.id}>
                                    {loc.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input placeholder="Customer Name" value={name} onChange={e => setName(e.target.value)} disabled={isSubmitting} />
                    <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} disabled={isSubmitting} />
                    <Input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} disabled={isSubmitting} />
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Start Date</label>
                            <DatePicker
                                date={startDate || new Date()}
                                setDate={setStartDate}
                                minDate={new Date()}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">End Date</label>
                            <DatePicker
                                date={endDate || (startDate ? addDays(startDate, 1) : addDays(new Date(), 1))}
                                setDate={setEndDate}
                                minDate={startDate || new Date()}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Booking..." : "Book"}</Button>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 