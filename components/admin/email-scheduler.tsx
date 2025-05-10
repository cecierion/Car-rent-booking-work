"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar, Clock, Mail, Plus, RefreshCw, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  scheduleReminderEmail,
  scheduleFollowUpEmail,
  scheduleReviewRequestEmail,
  cancelScheduledEmail,
  getScheduledEmailsForBooking,
  processScheduledEmails,
} from "@/lib/email-scheduler"
import type { Booking, Car, Location } from "@/lib/types"
import type { ScheduledEmail } from "@/lib/email-scheduler"

interface EmailSchedulerProps {
  booking: Booking
  car: Car
  location: Location
  cars: Car[]
  locations: Location[]
}

export function EmailScheduler({ booking, car, location, cars, locations }: EmailSchedulerProps) {
  const [scheduledEmails, setScheduledEmails] = useState<ScheduledEmail[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [emailType, setEmailType] = useState<"reminder" | "followup" | "review-request">("reminder")
  const [daysValue, setDaysValue] = useState<number>(2)
  const [isScheduling, setIsScheduling] = useState(false)

  // Load scheduled emails for this booking
  useEffect(() => {
    if (booking?.id) {
      const loadEmails = async () => {
        const emails = await getScheduledEmailsForBooking(booking.id)
        setScheduledEmails(emails)
      }
      loadEmails()
    }
  }, [booking?.id])

  const handleScheduleEmail = async () => {
    if (!booking) return

    setIsScheduling(true)

    try {
      let result

      switch (emailType) {
        case "reminder":
          result = await scheduleReminderEmail(booking, daysValue)
          break
        case "followup":
          result = await scheduleFollowUpEmail(booking, daysValue)
          break
        case "review-request":
          result = await scheduleReviewRequestEmail(booking, daysValue)
          break
      }

      if (result?.success) {
        // Refresh the list of scheduled emails
        const emails = await getScheduledEmailsForBooking(booking.id)
        setScheduledEmails(emails)
        setIsAddDialogOpen(false)
      } else {
        console.error("Failed to schedule email:", result?.error)
      }
    } catch (error) {
      console.error("Error scheduling email:", error)
    } finally {
      setIsScheduling(false)
    }
  }

  const handleCancelEmail = async (id: string) => {
    try {
      const result = await cancelScheduledEmail(id)

      if (result.success) {
        // Remove the cancelled email from the list
        setScheduledEmails(scheduledEmails.filter((email) => email.id !== id))
      } else {
        console.error("Failed to cancel email:", result.error)
      }
    } catch (error) {
      console.error("Error cancelling email:", error)
    }
  }

  const handleProcessEmails = async () => {
    setIsProcessing(true)

    try {
      const result = await processScheduledEmails(cars, locations)

      if (result.success) {
        // Refresh the list of scheduled emails
        const emails = await getScheduledEmailsForBooking(booking.id)
        setScheduledEmails(emails)
      } else {
        console.error("Failed to process emails:", result.error)
      }
    } catch (error) {
      console.error("Error processing emails:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getEmailTypeLabel = (type: string): string => {
    switch (type) {
      case "reminder":
        return "Pickup Reminder"
      case "followup":
        return "Follow-up"
      case "review-request":
        return "Review Request"
      default:
        return type
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Email Scheduler</CardTitle>
            <CardDescription>Schedule automated emails for this booking</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Email
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule New Email</DialogTitle>
                  <DialogDescription>Set up an automated email to be sent at a specific time.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email-type">Email Type</Label>
                    <Select value={emailType} onValueChange={(value) => setEmailType(value as any)}>
                      <SelectTrigger id="email-type">
                        <SelectValue placeholder="Select email type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reminder">Pickup Reminder</SelectItem>
                        <SelectItem value="followup">Follow-up</SelectItem>
                        <SelectItem value="review-request">Review Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="days-value">
                      {emailType === "reminder" ? "Days Before Pickup" : "Days After Return"}
                    </Label>
                    <Input
                      id="days-value"
                      type="number"
                      min="1"
                      max="30"
                      value={daysValue}
                      onChange={(e) => setDaysValue(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleScheduleEmail} disabled={isScheduling}>
                    {isScheduling ? "Scheduling..." : "Schedule Email"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={handleProcessEmails} disabled={isProcessing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isProcessing ? "animate-spin" : ""}`} />
              Process Emails
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {scheduledEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Mail className="h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">No scheduled emails</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Schedule emails to be sent automatically at specific times.
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Scheduled For</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduledEmails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{getEmailTypeLabel(email.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(email.scheduledFor), "MMM d, yyyy")}</span>
                        <Clock className="ml-4 mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(email.scheduledFor), "h:mm a")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {email.sent ? (
                        <Badge variant="success" className="flex items-center">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Sent {email.sentAt && format(new Date(email.sentAt), "MMM d")}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!email.sent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelEmail(email.id)}
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Cancel</span>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
