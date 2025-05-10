"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, ClipboardCheck } from "lucide-react"

export function AdminVerificationGuide() {
  const [activeTab, setActiveTab] = useState("bookings")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Admin Dashboard Verification Guide</CardTitle>
        <CardDescription>How to verify that bookings are properly appearing in the admin dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verify Bookings</AlertTitle>
                <AlertDescription>
                  Check that your new booking appears in the Bookings tab of the admin dashboard.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h3 className="font-medium">Steps to verify:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    Log in to the admin dashboard at <code>/admin</code>
                  </li>
                  <li>Click on the "Bookings" tab</li>
                  <li>Look for your booking with the customer name you entered</li>
                  <li>Verify that the booking status is "pending"</li>
                  <li>Check that the car and dates match what you selected</li>
                </ol>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">What you should see:</h4>
                <p>Your booking should appear in the list with:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Your name and email</li>
                  <li>The car you selected</li>
                  <li>The dates you chose</li>
                  <li>The total price</li>
                  <li>A "pending" status badge</li>
                  <li>Approve and Reject buttons</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customers">
            <div className="space-y-4">
              <Alert>
                <ClipboardCheck className="h-4 w-4" />
                <AlertTitle>Verify Customer Data</AlertTitle>
                <AlertDescription>
                  Check that your customer information has been added to the Customers section.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h3 className="font-medium">Steps to verify:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    Navigate to the Customers section at <code>/admin/customers</code>
                  </li>
                  <li>Search for the customer name or email you used for the booking</li>
                  <li>Click on the customer to view their details</li>
                  <li>Verify that the booking appears in their booking history</li>
                </ol>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">What you should see:</h4>
                <p>The customer record should show:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>The name, email, and phone you entered</li>
                  <li>A total of 1 booking (if this is your first test)</li>
                  <li>The total spent matching your booking amount</li>
                  <li>The booking ID in their booking history</li>
                  <li>"Active" status</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Verify Analytics</AlertTitle>
                <AlertDescription>
                  Check that the analytics data has been updated to include your new booking.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h3 className="font-medium">Steps to verify:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    Navigate to the Analytics section at <code>/admin/analytics</code>
                  </li>
                  <li>Check the summary statistics at the top</li>
                  <li>Look at the Booking Status chart</li>
                  <li>Check the Revenue by Car table</li>
                </ol>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">What you should see:</h4>
                <p>The analytics should reflect your new booking:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Increased total bookings count</li>
                  <li>Increased pending bookings count</li>
                  <li>The booking status chart should include your pending booking</li>
                  <li>The car you booked should show increased revenue in the Revenue by Car table</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
