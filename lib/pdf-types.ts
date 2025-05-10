// PDF document types
export type PdfDocumentType = "booking-confirmation" | "receipt" | "rental-agreement" | "invoice"

// PDF document interface
export interface PdfDocument {
  id: string
  type: PdfDocumentType
  title: string
  content: string
  createdAt: string
  bookingId: string
}
