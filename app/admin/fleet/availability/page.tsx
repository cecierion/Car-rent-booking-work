import { getCars, getBookings, getLocations } from "@/lib/server-actions"
import { FleetAvailabilityView } from "@/components/admin/fleet-availability-view"

export default async function FleetAvailabilityPage() {
    const [cars, bookings, locations] = await Promise.all([
        getCars(),
        getBookings(),
        getLocations(),
    ])

    return (
        <div className="container py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Fleet Availability</h1>
                <p className="text-muted-foreground">
                    View and manage the availability of all cars in the fleet
                </p>
            </div>

            <FleetAvailabilityView
                cars={cars}
                bookings={bookings}
                locations={locations}
            />
        </div>
    )
} 