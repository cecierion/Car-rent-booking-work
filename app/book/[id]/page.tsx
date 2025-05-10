import { getCar } from "@/lib/server-actions"
import { BookingForm } from "@/components/booking-form"
import { locationsData } from "@/lib/data"

export default async function BookingPage({
  params,
}: {
  params: { id: string }
}) {
  const car = await getCar(params.id)

  if (!car) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold text-red-600">Car not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Book {car.make} {car.model}</h1>
      <BookingForm car={car} locations={locationsData} />
    </div>
  )
}
