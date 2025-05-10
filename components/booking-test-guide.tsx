"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, CheckCircle } from "lucide-react"

export function BookingTestGuide() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isComplete, setIsComplete] = useState(false)

  const steps = [
    {
      title: "Start on the Home Page",
      description: "Begin at the home page of the car rental website.",
      instructions: "Navigate to the home page by clicking on the logo or the 'Home' link in the navigation bar.",
    },
    {
      title: "Search for a Car",
      description: "Use the search form in the hero section to find available cars.",
      instructions: "Select a location, pickup date, and return date, then click 'Search Cars'.",
    },
    {
      title: "Select a Car",
      description: "Choose a car from the search results.",
      instructions: "Browse the available cars and click the 'Book Now' button on the car you want to rent.",
    },
    {
      title: "Fill Out Booking Form",
      description: "Complete the booking form with your information.",
      instructions:
        "Enter your name, email, phone number, and confirm the rental details, then click 'Request Booking'.",
    },
    {
      title: "View Confirmation",
      description: "Check the booking confirmation page.",
      instructions: "After submitting, you'll be redirected to a confirmation page with your booking details.",
    },
    {
      title: "Log into Admin Dashboard",
      description: "Access the admin dashboard to verify the booking.",
      instructions: "Navigate to /admin and log in with your admin credentials.",
    },
    {
      title: "Check Bookings Tab",
      description: "Verify the booking appears in the bookings list.",
      instructions: "In the admin dashboard, click on the 'Bookings' tab and look for your new booking.",
    },
    {
      title: "Verify Customer Data",
      description: "Confirm the customer information was added.",
      instructions: "Go to the 'Customers' section and check that the customer details from the booking are present.",
    },
    {
      title: "Check Analytics",
      description: "Ensure the analytics reflect the new booking.",
      instructions: "Visit the 'Analytics' section and verify that the new booking is included in the statistics.",
    },
  ]

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Booking Test Guide</CardTitle>
        <CardDescription>
          Follow these steps to test the booking flow and verify it in the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Progress</h3>
            <Badge variant="outline">
              {currentStep} of {steps.length}
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current Step</TabsTrigger>
            <TabsTrigger value="all">All Steps</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    {currentStep}
                  </span>
                  {steps[currentStep - 1].title}
                </CardTitle>
                <CardDescription>{steps[currentStep - 1].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Instructions:</h4>
                  <p>{steps[currentStep - 1].instructions}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 1}>
                  Previous
                </Button>
                <Button onClick={handleNextStep} disabled={isComplete}>
                  {currentStep === steps.length ? "Complete" : "Next"}
                  {currentStep === steps.length ? (
                    <CheckCircle className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowRight className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-md ${
                    currentStep > index + 1
                      ? "border-green-200 bg-green-50"
                      : currentStep === index + 1
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                        currentStep > index + 1
                          ? "bg-green-500 text-white"
                          : currentStep === index + 1
                            ? "bg-primary text-primary-foreground"
                            : "bg-gray-200"
                      }`}
                    >
                      {currentStep > index + 1 ? <Check className="h-3 w-3" /> : index + 1}
                    </div>
                    <h3 className="font-medium">{step.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            {isComplete ? (
              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Test Complete!</h3>
                <p className="text-muted-foreground">
                  You've successfully tested the booking flow from the home page to the admin dashboard.
                </p>
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-muted-foreground">
                  You haven't completed all the steps yet. Continue following the guide to complete the test.
                </p>
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="mt-4">
                  Start Over
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
