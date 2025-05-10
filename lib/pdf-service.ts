import type { Booking, Car, Location, Customer } from "@/lib/types"

// PDF document types
export type PdfDocumentType = "booking-confirmation" | "receipt" | "rental-agreement" | "invoice"

// PDF document interface
export interface PdfDocument {
  id: string
  type: PdfDocumentType
  bookingId: string
  createdAt: string
  filename: string
  url: string // In a real app, this would be a URL to the stored PDF
}

// In-memory store for generated PDFs (in a real app, this would be in a database)
export const generatedPdfs: PdfDocument[] = []

/**
 * Generate a PDF document
 * In a real app, this would use a library like jspdf, pdfkit, or a PDF generation service
 */
export async function generatePdf(
  type: PdfDocumentType,
  booking: Booking,
  car: Car,
  location: Location,
  customer?: Customer,
): Promise<{ success: boolean; document?: PdfDocument; error?: string }> {
  "use server"
  try {
    console.log(`Generating ${type} PDF for booking ${booking.id}`)

    // Simulate PDF generation delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a unique ID for this document
    const documentId = `pdf-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    // Create a filename based on the document type and booking ID
    const filename = `${type}-${booking.id}.pdf`

    // In a real app, you would generate the PDF here and store it
    // For demo purposes, we'll just create a mock document
    const document: PdfDocument = {
      id: documentId,
      type,
      bookingId: booking.id,
      createdAt: new Date().toISOString(),
      filename,
      url: `/api/pdf/${documentId}`, // In a real app, this would be a real URL
    }

    // Add to generated PDFs
    generatedPdfs.push(document)

    return {
      success: true,
      document,
    }
  } catch (error) {
    console.error(`Error generating ${type} PDF:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : `Failed to generate ${type} PDF`,
    }
  }
}

/**
 * Get all generated PDFs
 */
export async function getGeneratedPdfs(): Promise<PdfDocument[]> {
  "use server"
  return [...generatedPdfs]
}

/**
 * Get generated PDFs for a specific booking
 */
export async function getGeneratedPdfsForBooking(bookingId: string): Promise<PdfDocument[]> {
  "use server"
  return generatedPdfs.filter((pdf) => pdf.bookingId === bookingId)
}

/**
 * Delete a generated PDF
 */
export async function deleteGeneratedPdf(id: string): Promise<{ success: boolean; error?: string }> {
  "use server"
  try {
    const pdfIndex = generatedPdfs.findIndex((pdf) => pdf.id === id)

    if (pdfIndex === -1) {
      return {
        success: false,
        error: "Generated PDF not found",
      }
    }

    // Remove the PDF from the generated PDFs
    const updatedPdfs = generatedPdfs.filter((pdf) => pdf.id !== id)

    // In a real app, you would also delete the actual PDF file

    // Update our in-memory store
    generatedPdfs.length = 0
    generatedPdfs.push(...updatedPdfs)

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting generated PDF:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete generated PDF",
    }
  }
}

/**
 * Get the title for a PDF document type
 */
export async function getPdfTitle(type: PdfDocumentType): Promise<string> {
  "use server"
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

/**
 * Generate the content for a PDF document
 */
export async function generatePdfContent(
  type: PdfDocumentType,
  booking: Booking,
  car: Car,
  location: Location,
): Promise<string> {
  "use server"
  // In a real app, this would generate HTML that would be converted to PDF
  // For this example, we'll just return some placeholder HTML

  const commonDetails = `
   <div style="margin-bottom: 20px;">
     <h2>Booking Details</h2>
     <p><strong>Booking ID:</strong> ${booking.id}</p>
     <p><strong>Customer:</strong> ${booking.name}</p>
     <p><strong>Email:</strong> ${booking.email}</p>
     <p><strong>Phone:</strong> ${booking.phone}</p>
     <p><strong>Dates:</strong> ${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()}</p>
     <p><strong>Total Price:</strong> $${booking.totalPrice.toFixed(2)}</p>
   </div>
   
   <div style="margin-bottom: 20px;">
     <h2>Car Details</h2>
     <p><strong>Make:</strong> ${car.make}</p>
     <p><strong>Model:</strong> ${car.model}</p>
     <p><strong>Year:</strong> ${car.year}</p>
     <p><strong>Color:</strong> ${car.color || "N/A"}</p>
     <p><strong>License Plate:</strong> ${car.licensePlate || "N/A"}</p>
   </div>
   
   <div style="margin-bottom: 20px;">
     <h2>Location Details</h2>
     <p><strong>Name:</strong> ${location.name}</p>
     <p><strong>Address:</strong> ${location.address}, ${location.city}, ${location.state} ${location.zipCode}</p>
     <p><strong>Phone:</strong> ${location.phone}</p>
   </div>
 `

  switch (type) {
    case "booking-confirmation":
      return `
       <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
         <div style="text-align: center; margin-bottom: 30px;">
           <h1>Booking Confirmation</h1>
           <p>Thank you for choosing our car rental service!</p>
         </div>
         
         ${commonDetails}
         
         <div style="margin-bottom: 20px;">
           <h2>Next Steps</h2>
           <p>Please bring the following items when you pick up your car:</p>
           <ul>
             <li>Valid driver's license</li>
             <li>Credit card in your name</li>
             <li>This booking confirmation</li>
           </ul>
         </div>
         
         <div style="margin-top: 40px; text-align: center; color: #666; font-size: 14px;">
           <p>If you have any questions, please contact our customer service.</p>
           <p>&copy; ${new Date().getFullYear()} Car Rental Service. All rights reserved.</p>
         </div>
       </div>
     `

    case "receipt":
      return `
       <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
         <div style="text-align: center; margin-bottom: 30px;">
           <h1>Receipt</h1>
           <p>Receipt #: R-${Date.now().toString().substring(6)}</p>
           <p>Date: ${new Date().toLocaleDateString()}</p>
         </div>
         
         ${commonDetails}
         
         <div style="margin-bottom: 20px;">
           <h2>Payment Details</h2>
           <table style="width: 100%; border-collapse: collapse;">
             <tr style="background-color: #f2f2f2;">
               <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Description</th>
               <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Amount</th>
             </tr>
             <tr>
               <td style="padding: 8px; border: 1px solid #ddd;">Car Rental (${car.make} ${car.model})</td>
               <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$${(booking.totalPrice * 0.8).toFixed(2)}</td>
             </tr>
             <tr>
               <td style="padding: 8px; border: 1px solid #ddd;">Insurance</td>
               <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$${(booking.totalPrice * 0.1).toFixed(2)}</td>
             </tr>
             <tr>
               <td style="padding: 8px; border: 1px solid #ddd;">Taxes</td>
               <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$${(booking.totalPrice * 0.1).toFixed(2)}</td>
             </tr>
             <tr style="font-weight: bold;">
               <td style="padding: 8px; border: 1px solid #ddd;">Total</td>
               <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$${booking.totalPrice.toFixed(2)}</td>
             </tr>
           </table>
         </div>
         
         <div style="margin-top: 40px; text-align: center; color: #666; font-size: 14px;">
           <p>Thank you for your business!</p>
           <p>&copy; ${new Date().getFullYear()} Car Rental Service. All rights reserved.</p>
         </div>
       </div>
     `

    case "rental-agreement":
      return `
       <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
         <div style="text-align: center; margin-bottom: 30px;">
           <h1>Rental Agreement</h1>
           <p>Agreement #: RA-${Date.now().toString().substring(6)}</p>
           <p>Date: ${new Date().toLocaleDateString()}</p>
         </div>
         
         ${commonDetails}
         
         <div style="margin-bottom: 20px;">
           <h2>Terms and Conditions</h2>
           <p>This Rental Agreement ("Agreement") is entered into between Car Rental Service ("Company") and the customer named above ("Renter").</p>
           
           <h3>1. Vehicle Use</h3>
           <p>Renter agrees to use the Vehicle only for personal or routine business use, and operate the Vehicle only on properly maintained roads and parking lots. Renter is responsible for all damage or loss caused to the Vehicle.</p>
           
           <h3>2. Return of Vehicle</h3>
           <p>Renter agrees to return the Vehicle to the designated return location, on the date and time specified above, with the same level of fuel as when received.</p>
           
           <h3>3. Insurance</h3>
           <p>Renter must maintain automobile insurance covering the Renter, the Vehicle, and the Company in amounts and types satisfactory to the Company.</p>
         </div>
         
         <div style="margin-top: 40px;">
           <h2>Signatures</h2>
           <div style="display: flex; justify-content: space-between; margin-top: 20px;">
             <div style="width: 45%;">
               <p style="border-top: 1px solid #000; padding-top: 5px;">Renter Signature</p>
             </div>
             <div style="width: 45%;">
               <p style="border-top: 1px solid #000; padding-top: 5px;">Company Representative</p>
             </div>
           </div>
         </div>
         
         <div style="margin-top: 40px; text-align: center; color: #666; font-size: 14px;">
           <p>&copy; ${new Date().getFullYear()} Car Rental Service. All rights reserved.</p>
         </div>
       </div>
     `

    case "invoice":
      return `
       <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
         <div style="text-align: center; margin-bottom: 30px;">
           <h1>Invoice</h1>
           <p>Invoice #: INV-${Date.now().toString().substring(6)}</p>
           <p>Date: ${new Date().toLocaleDateString()}</p>
           <p>Due Date: ${new Date().toLocaleDateString()}</p>
         </div>
         
         ${commonDetails}
         
         <div style="margin-bottom: 20px;">
           <h2>Invoice Details</h2>
           <table style="width: 100%; border-collapse: collapse;">
             <tr style="background-color: #f2f2f2;">
               <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Description</th>
               <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Amount</th>
             </tr>
             <tr>
               <td style="padding: 8px; border: 1px solid #ddd;">Car Rental (${car.make} ${car.model})</td>
               <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$${(booking.totalPrice * 0.8).toFixed(2)}</td>
             </tr>
             <tr>
               <td style="padding: 8px; border: 1px solid #ddd;">Insurance</td>
               <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$${(booking.totalPrice * 0.1).toFixed(2)}</td>
             </tr>
             <tr>
               <td style="padding: 8px; border: 1px solid #ddd;">Taxes</td>
               <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$${(booking.totalPrice * 0.1).toFixed(2)}</td>
             </tr>
             <tr style="font-weight: bold;">
               <td style="padding: 8px; border: 1px solid #ddd;">Total</td>
               <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$${booking.totalPrice.toFixed(2)}</td>
             </tr>
           </table>
         </div>
         
         <div style="margin-bottom: 20px;">
           <h2>Payment Instructions</h2>
           <p>Please make payment to the following account:</p>
           <p><strong>Bank:</strong> Example Bank</p>
           <p><strong>Account Name:</strong> Car Rental Service</p>
           <p><strong>Account Number:</strong> XXXX-XXXX-XXXX-1234</p>
           <p><strong>Reference:</strong> INV-${Date.now().toString().substring(6)}</p>
         </div>
         
         <div style="margin-top: 40px; text-align: center; color: #666; font-size: 14px;">
           <p>Thank you for your business!</p>
           <p>&copy; ${new Date().getFullYear()} Car Rental Service. All rights reserved.</p>
         </div>
       </div>
     `

    default:
      return `<p>Document content not available.</p>`
  }
}

/**
 * Generate HTML content for a booking confirmation PDF
 */
export async function generateBookingConfirmationHtml(booking: Booking, car: Car, location: Location): Promise<string> {
  "use server"
  return `
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="utf-8">
     <title>Booking Confirmation</title>
     <style>
       body {
         font-family: Arial, sans-serif;
         margin: 0;
         padding: 20px;
         color: #333;
       }
       .header {
         text-align: center;
         margin-bottom: 30px;
       }
       .logo {
         font-size: 24px;
         font-weight: bold;
         margin-bottom: 10px;
       }
       .title {
         font-size: 20px;
         margin-bottom: 5px;
       }
       .subtitle {
         font-size: 16px;
         color: #666;
       }
       .section {
         margin-bottom: 20px;
         padding: 15px;
         border-radius: 5px;
         background-color: #f9f9f9;
       }
       .section-title {
         font-size: 18px;
         margin-top: 0;
         margin-bottom: 10px;
       }
       .detail-row {
         display: flex;
         margin-bottom: 5px;
       }
       .detail-label {
         font-weight: bold;
         width: 150px;
       }
       .footer {
         margin-top: 30px;
         text-align: center;
         font-size: 14px;
         color: #666;
         border-top: 1px solid #eee;
         padding-top: 20px;
       }
     </style>
   </head>
   <body>
     <div class="header">
       <div class="logo">Car Rental Service</div>
       <div class="title">Booking Confirmation</div>
       <div class="subtitle">Thank you for your reservation</div>
     </div>
     
     <div class="section">
       <h2 class="section-title">Booking Details</h2>
       <div class="detail-row">
         <div class="detail-label">Booking ID:</div>
         <div>${booking.id}</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Status:</div>
         <div>${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Booking Date:</div>
         <div>${new Date(booking.createdAt).toLocaleDateString()}</div>
       </div>
     </div>
     
     <div class="section">
       <h2 class="section-title">Customer Information</h2>
       <div class="detail-row">
         <div class="detail-label">Name:</div>
         <div>${booking.name}</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Email:</div>
         <div>${booking.email}</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Phone:</div>
         <div>${booking.phone}</div>
       </div>
     </div>
     
     <div class="section">
       <h2 class="section-title">Vehicle Information</h2>
       <div class="detail-row">
         <div class="detail-label">Vehicle:</div>
         <div>${car.make} ${car.model} (${car.year})</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Transmission:</div>
         <div>${car.transmission}</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Fuel Type:</div>
         <div>${car.fuelType}</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Seats:</div>
         <div>${car.seats}</div>
       </div>
     </div>
     
     <div class="section">
       <h2 class="section-title">Rental Details</h2>
       <div class="detail-row">
         <div class="detail-label">Pickup Location:</div>
         <div>${location.name}</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Address:</div>
         <div>${location.address}, ${location.city}, ${location.state} ${location.zipCode}</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Pickup Date:</div>
         <div>${new Date(booking.startDate).toLocaleDateString()}</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Return Date:</div>
         <div>${new Date(booking.endDate).toLocaleDateString()}</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Total Price:</div>
         <div>$${booking.totalPrice.toFixed(2)}</div>
       </div>
     </div>
     
     <div class="section">
       <h2 class="section-title">Important Information</h2>
       <p>Please bring the following items when you pick up your car:</p>
       <ul>
         <li>Valid driver's license</li>
         <li>Credit card in your name</li>
         <li>This booking confirmation</li>
       </ul>
       <p>If you need to modify or cancel your booking, please contact us at least 24 hours before your pickup time.</p>
     </div>
     
     <div class="footer">
       <p>Thank you for choosing our car rental service!</p>
       <p>&copy; ${new Date().getFullYear()} Car Rental Service. All rights reserved.</p>
     </div>
   </body>
   </html>
 `
}

/**
 * Generate HTML content for a receipt PDF
 */
export async function generateReceiptHtml(booking: Booking, car: Car, location: Location): Promise<string> {
  "use server"
  // Calculate rental duration in days
  const startDate = new Date(booking.startDate)
  const endDate = new Date(booking.endDate)
  const rentalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  // Calculate subtotal (price per day * days)
  const subtotal = car.pricePerDay * rentalDays

  // Calculate tax (assuming 10% tax rate)
  const taxRate = 0.1
  const tax = subtotal * taxRate

  // Calculate total
  const total = subtotal + tax

  return `
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="utf-8">
     <title>Receipt</title>
     <style>
       body {
         font-family: Arial, sans-serif;
         margin: 0;
         padding: 20px;
         color: #333;
       }
       .header {
         text-align: center;
         margin-bottom: 30px;
       }
       .logo {
         font-size: 24px;
         font-weight: bold;
         margin-bottom: 10px;
       }
       .title {
         font-size: 20px;
         margin-bottom: 5px;
       }
       .receipt-id {
         font-size: 14px;
         color: #666;
       }
       .section {
         margin-bottom: 20px;
       }
       .section-title {
         font-size: 18px;
         margin-top: 0;
         margin-bottom: 10px;
         border-bottom: 1px solid #eee;
         padding-bottom: 5px;
       }
       .detail-row {
         display: flex;
         margin-bottom: 5px;
       }
       .detail-label {
         font-weight: bold;
         width: 150px;
       }
       .table {
         width: 100%;
         border-collapse: collapse;
         margin-bottom: 20px;
       }
       .table th {
         background-color: #f5f5f5;
         text-align: left;
         padding: 8px;
         border-bottom: 2px solid #ddd;
       }
       .table td {
         padding: 8px;
         border-bottom: 1px solid #ddd;
       }
       .table .amount {
         text-align: right;
       }
       .total-row {
         font-weight: bold;
       }
       .footer {
         margin-top: 30px;
         text-align: center;
         font-size: 14px;
         color: #666;
         border-top: 1px solid #eee;
         padding-top: 20px;
       }
     </style>
   </head>
   <body>
     <div class="header">
       <div class="logo">Car Rental Service</div>
       <div class="title">Receipt</div>
       <div class="receipt-id">Receipt #: R-${Date.now().toString().substring(7)}</div>
       <div class="receipt-id">Date: ${new Date().toLocaleDateString()}</div>
     </div>
     
     <div class="section">
       <h2 class="section-title">Customer Information</h2>
       <div class="detail-row">
         <div class="detail-label">Name:</div>
         <div>${booking.name}</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Email:</div>
         <div>${booking.email}</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Booking ID:</div>
         <div>${booking.id}</div>
       </div>
     </div>
     
     <div class="section">
       <h2 class="section-title">Rental Details</h2>
       <div class="detail-row">
         <div class="detail-label">Vehicle:</div>
         <div>${car.make} ${car.model} (${car.year})</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Pickup Location:</div>
         <div>${location.name}</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Pickup Date:</div>
         <div>${new Date(booking.startDate).toLocaleDateString()}</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Return Date:</div>
         <div>${new Date(booking.endDate).toLocaleDateString()}</div>
       </div>
       <div class="detail-row">
         <div class="detail-label">Rental Duration:</div>
         <div>${rentalDays} day${rentalDays > 1 ? "s" : ""}</div>
       </div>
     </div>
     
     <div class="section">
       <h2 class="section-title">Charges</h2>
       <table class="table">
         <thead>
           <tr>
             <th>Description</th>
             <th>Amount</th>
           </tr>
         </thead>
         <tbody>
           <tr>
             <td>Car Rental (${car.make} ${car.model})</td>
             <td class="amount">$${subtotal.toFixed(2)}</td>
           </tr>
           <tr>
             <td>Tax (${(taxRate * 100).toFixed(0)}%)</td>
             <td class="amount">$${tax.toFixed(2)}</td>
           </tr>
           <tr class="total-row">
             <td>Total</td>
             <td class="amount">$${total.toFixed(2)}</td>
           </tr>
         </tbody>
       </table>
     </div>
     
     <div class="footer">
       <p>Thank you for your business!</p>
       <p>&copy; ${new Date().getFullYear()} Car Rental Service. All rights reserved.</p>
     </div>
   </body>
   </html>
 `
}
