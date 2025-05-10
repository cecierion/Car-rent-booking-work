import { getLocations } from "@/lib/server-actions"
import { AddCarForm } from "@/components/admin/add-car-form"

export default async function AddCarPage() {
    const locations = await getLocations()

    return (
        <div className="container py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Add New Car</h1>
                <p className="text-muted-foreground mt-2">
                    Add a new car to your rental fleet. Fill in all required fields marked with an asterisk (*).
                </p>
            </div>

            <div className="bg-card rounded-lg border p-6">
                <AddCarForm locations={locations} />
            </div>
        </div>
    )
} 