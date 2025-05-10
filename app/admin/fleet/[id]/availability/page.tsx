import { getCar, getBookingsForCar } from "@/lib/server-actions"
import { CarAvailabilityCard } from "@/components/admin/car-availability-card"
import { notFound } from "next/navigation"

interface CarAvailabilityPageProps {
    params: {
        id: string
    }
}

export default async function CarAvailabilityPage({ params }: CarAvailabilityPageProps) {
    const car = await getCar(params.id)
    if (!car) {
        notFound()
    }

    const bookings = await getBookingsForCar(params.id)

    return (
        <div className="container py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Car Availability</h1>
                <p className="text-muted-foreground mt-2">
                    View and manage availability for {car.make} {car.model} ({car.year})
                </p>
            </div>

            <CarAvailabilityCard car={car} bookings={bookings} />
        </div>
    )
} 