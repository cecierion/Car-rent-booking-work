import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CarSearchForm } from "@/components/car-search-form"
import type { Location } from "@/lib/data-context"
import Image from "next/image"

interface HeroProps {
  onSearch?: (location: string, pickupDate: Date, returnDate: Date) => void
  locations: Location[]
}

export function Hero({ onSearch, locations }: HeroProps) {
  return (
    <div className="relative bg-gray-900 py-24 text-white">
      <div
        className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-800/90 opacity-90"
        style={{ backgroundImage: "none" }}
      />
      <div className="container relative mx-auto px-4">
        <div className="mb-12 text-center">
          <Image
            src="/logo.png"
            alt="LëvizRent Logo"
            width={260}
            height={120}
            className="mx-auto mb-6 drop-shadow-lg"
            priority
          />
          <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl text-yellow-400">Premium Car Rental</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
            Rent your dream car today with our easy booking process and competitive rates.
          </p>
        </div>

        <CarSearchForm onSearch={onSearch} locations={locations} />

        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" variant="outline" className="font-semibold border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900">
            <Link href="#cars">Browse All Cars</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
