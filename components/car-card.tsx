import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import type { Car } from "@/lib/types"
import type { Location } from "@/lib/data-context"

interface CarCardProps {
  car: Car
  location?: Location
}

export function CarCard({ car, location }: CarCardProps) {
  // Check if the image is a data URL (from our file upload)
  const isDataUrl = car.image?.startsWith("data:image/")

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          {isDataUrl ? (
            // For data URLs, use a regular img tag
            <img
              src={car.image || "/placeholder.svg"}
              alt={`${car.make} ${car.model}`}
              className="object-cover w-full h-full"
            />
          ) : (
            // For regular URLs, use Next.js Image component
            <Image
              src={car.image || `/placeholder.svg?height=300&width=500&text=${car.make}+${car.model}`}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold">
          {car.make} {car.model}
        </h3>
        {location && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            <span>{location.name}</span>
          </div>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">{car.year}</span>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">{car.transmission}</span>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">{car.fuelType}</span>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">{car.seats} seats</span>
        </div>
        <p className="mt-4 text-2xl font-bold">
          ${car.pricePerDay} <span className="text-sm font-normal text-gray-500">per day</span>
        </p>
        <p className="mt-1 text-sm text-gray-500">{car.available ? "Available Now" : "Currently Unavailable"}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" disabled={!car.available}>
          <Link href={`/book/${car.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
