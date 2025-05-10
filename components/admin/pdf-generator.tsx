"use client"

import { useState } from "react"
import { FileText, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generatePdf } from "@/lib/pdf-service"
import type { Booking, Car, Location, Customer } from "@/lib/types"
import type { PdfDocumentType } from "@/lib/pdf-service"

interface PdfGeneratorProps {
  booking: Booking
  car: Car
  location: Location
  customer?: Customer
}

export function PdfGenerator({ booking, car, location, customer }: PdfGeneratorProps) {
  const [activeTab, setActiveTab] = useState<PdfDocumentType>("booking-confirmation")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null)

  const handleGeneratePdf = async () => {
    setIsGenerating(true)
    setGeneratedPdfUrl(null)

    try {
      const result = await generatePdf(activeTab, booking, car, location, customer)

      if (result.success && result.document) {
        setGeneratedPdfUrl(result.document.url)
      } else {
        console.error("Failed to generate PDF:", result.error)
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getPdfTitle = (type: PdfDocumentType): string => {
    switch (type) {
      case "booking-confirmation":
        return "Booking Confirmation"
      case "receipt":
        return "Receipt"
      case "rental-agreement":
        return "Rental Agreement"
      case "invoice":
        return "Invoice"
      default:
        return "Document"
    }
  }

  const getPdfDescription = (type: PdfDocumentType): string => {
    switch (type) {
      case "booking-confirmation":
        return "Generate a PDF confirmation of the booking details."
      case "receipt":
        return "Generate a receipt for the booking payment."
      case "rental-agreement":
        return "Generate a rental agreement document."
      case "invoice":
        return "Generate an invoice for the booking."
      default:
        return "Generate a document."
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate PDF Documents</CardTitle>
        <CardDescription>Create and download PDF documents for this booking</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="booking-confirmation"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as PdfDocumentType)}
        >
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="booking-confirmation">Confirmation</TabsTrigger>
            <TabsTrigger value="receipt">Receipt</TabsTrigger>
            <TabsTrigger value="rental-agreement">Agreement</TabsTrigger>
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
          </TabsList>
          <TabsContent value="booking-confirmation" className="mt-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-medium">{getPdfTitle("booking-confirmation")}</h3>
                <p className="text-sm text-muted-foreground">{getPdfDescription("booking-confirmation")}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="receipt" className="mt-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-medium">{getPdfTitle("receipt")}</h3>
                <p className="text-sm text-muted-foreground">{getPdfDescription("receipt")}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="rental-agreement" className="mt-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-medium">{getPdfTitle("rental-agreement")}</h3>
                <p className="text-sm text-muted-foreground">{getPdfDescription("rental-agreement")}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="invoice" className="mt-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-medium">{getPdfTitle("invoice")}</h3>
                <p className="text-sm text-muted-foreground">{getPdfDescription("invoice")}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleGeneratePdf} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate PDF
            </>
          )}
        </Button>
        {generatedPdfUrl && (
          <Button asChild>
            <a href={generatedPdfUrl} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
