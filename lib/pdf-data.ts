import type { PdfDocument } from "./pdf-types"

// In-memory store for generated PDFs (in a real app, this would be in a database)
export const pdfDocuments: PdfDocument[] = []

// PDF document types
export type { PdfDocumentType, PdfDocument } from "./pdf-types"
