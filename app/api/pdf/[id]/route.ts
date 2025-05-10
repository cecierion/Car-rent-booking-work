import { type NextRequest, NextResponse } from "next/server"
import { getGeneratedPdfs } from "@/lib/pdf-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // In a real app, you would fetch the PDF from storage
    // For demo purposes, we'll just return a mock PDF response

    // Find the PDF document
    const pdfs = getGeneratedPdfs()
    const pdf = pdfs.find((p) => p.id === id)

    if (!pdf) {
      return new NextResponse("PDF not found", { status: 404 })
    }

    // In a real app, you would return the actual PDF file
    // For demo purposes, we'll return a simple text response
    return new NextResponse(`This is a mock PDF document: ${pdf.type} for booking ${pdf.bookingId}`, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${pdf.filename}"`,
      },
    })
  } catch (error) {
    console.error("Error serving PDF:", error)
    return new NextResponse("Error serving PDF", { status: 500 })
  }
}
