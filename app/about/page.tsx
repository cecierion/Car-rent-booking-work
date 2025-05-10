import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold">About CarRental</h1>

          <div className="mb-8 space-y-4">
            <p>
              Welcome to CarRental, your premier destination for quality vehicle rentals. Established with a vision to
              provide exceptional service and a diverse fleet of vehicles, we've been serving customers with pride since
              2010.
            </p>

            <p>
              Our mission is to make car rental simple, affordable, and enjoyable. Whether you need a vehicle for
              business, leisure, or any other purpose, we have the perfect car to meet your needs.
            </p>
          </div>

          <h2 className="mb-4 text-2xl font-bold">Why Choose Us?</h2>
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-semibold">Quality Vehicles</h3>
              <p className="text-sm">
                Our fleet consists of well-maintained, late-model vehicles to ensure your safety and comfort.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-semibold">Competitive Rates</h3>
              <p className="text-sm">
                We offer some of the most competitive rates in the industry without compromising on quality.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-semibold">Flexible Rental Options</h3>
              <p className="text-sm">
                From daily to monthly rentals, we have plans to accommodate your specific needs.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-semibold">Exceptional Service</h3>
              <p className="text-sm">
                Our dedicated team is committed to providing you with the best rental experience possible.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button asChild size="lg">
              <Link href="/#cars">Browse Our Fleet</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
