"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  generateBookingApprovedEmail,
  generateBookingCancelledEmail,
  generateBookingConfirmationEmail,
  generateBookingRejectedEmail,
  generateBookingReminderEmail,
  sendEmail,
} from "@/lib/email-service"
import type { Booking, Car, Customer, Location } from "@/lib/types"

interface EmailTemplatePreviewProps {
  title: string
  template: "booking-confirmation" | "booking-approved" | "booking-rejected" | "booking-cancelled" | "booking-reminder"
  booking: Booking
  car: Car
  location: Location
  customer: Customer
  reason?: string
  daysUntilPickup?: number
}

export function EmailTemplatePreview({
  title,
  template,
  booking,
  car,
  location,
  customer,
  reason = "The requested vehicle is not available for the selected dates.",
  daysUntilPickup = 2,
}: EmailTemplatePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSendTestEmail = async () => {
    setIsSending(true)
    try {
      let emailData

      switch (template) {
        case "booking-confirmation":
          emailData = await generateBookingConfirmationEmail(booking, car, location)
          break
        case "booking-approved":
          emailData = await generateBookingApprovedEmail(booking, car, location)
          break
        case "booking-rejected":
          emailData = await generateBookingRejectedEmail(booking, car, location, reason)
          break
        case "booking-cancelled":
          emailData = await generateBookingCancelledEmail(booking, car, location, reason)
          break
        case "booking-reminder":
          emailData = await generateBookingReminderEmail(booking, car, location, daysUntilPickup)
          break
        default:
          emailData = await generateBookingConfirmationEmail(booking, car, location)
      }

      // Override the recipient to the customer's email for the test
      emailData.to = customer.email

      await sendEmail(emailData)
      setEmailSent(true)

      // Reset the sent status after 3 seconds
      setTimeout(() => {
        setEmailSent(false)
      }, 3000)
    } catch (error) {
      console.error("Error sending test email:", error)
    } finally {
      setIsSending(false)
    }
  }

  const getEmailPreview = async () => {
    try {
      switch (template) {
        case "booking-confirmation":
          return await generateBookingConfirmationEmail(booking, car, location)
        case "booking-approved":
          return await generateBookingApprovedEmail(booking, car, location)
        case "booking-rejected":
          return await generateBookingRejectedEmail(booking, car, location, reason)
        case "booking-cancelled":
          return await generateBookingCancelledEmail(booking, car, location, reason)
        case "booking-reminder":
          return await generateBookingReminderEmail(booking, car, location, daysUntilPickup)
        default:
          return await generateBookingConfirmationEmail(booking, car, location)
      }
    } catch (error) {
      console.error("Error generating email preview:", error)
      return { to: "", subject: "", body: "Error generating email preview" }
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendTestEmail}
            disabled={isSending}
            className="h-8 px-2 text-xs"
          >
            {isSending ? (
              "Sending..."
            ) : emailSent ? (
              "Sent!"
            ) : (
              <>
                <Mail className="mr-1 h-3 w-3" /> Send Test
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-2">
          <div className="rounded border p-3 text-sm">
            <p>
              <strong>To:</strong> {customer.email}
            </p>
            <p>
              <strong>Subject:</strong> {getEmailPreview().then((email) => email.subject)}
            </p>
            <div className="mt-2 max-h-60 overflow-auto rounded border p-2">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: getEmailPreview().then((email) => email.body) }}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
