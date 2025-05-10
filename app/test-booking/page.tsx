import { BookingTestGuide } from "@/components/booking-test-guide"
import { AdminVerificationGuide } from "@/components/admin-verification-guide"
import { BookingFlowComparison } from "@/components/booking-flow-comparison"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Separator } from "@/components/ui/separator"

export default function TestBookingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Test Booking Flow</h1>
        <BookingTestGuide />

        <Separator className="my-12" />

        <h2 className="text-2xl font-bold mb-8 text-center">Admin Verification</h2>
        <AdminVerificationGuide />

        <Separator className="my-12" />

        <h2 className="text-2xl font-bold mb-8 text-center">Before & After Comparison</h2>
        <BookingFlowComparison />
      </main>
      <Footer />
    </div>
  )
}
