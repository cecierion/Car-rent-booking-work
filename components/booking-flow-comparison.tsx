import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle } from "lucide-react"

export function BookingFlowComparison() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Booking Flow Comparison</CardTitle>
        <CardDescription>Comparison of the booking flow before and after the fix</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Feature</TableHead>
              <TableHead>Before Fix</TableHead>
              <TableHead>After Fix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Bookings appear in dashboard</TableCell>
              <TableCell className="text-red-500">
                <XCircle className="h-4 w-4 inline mr-2" /> No
              </TableCell>
              <TableCell className="text-green-500">
                <CheckCircle className="h-4 w-4 inline mr-2" /> Yes
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Customer data created</TableCell>
              <TableCell className="text-red-500">
                <XCircle className="h-4 w-4 inline mr-2" /> No
              </TableCell>
              <TableCell className="text-green-500">
                <CheckCircle className="h-4 w-4 inline mr-2" /> Yes
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Analytics updated</TableCell>
              <TableCell className="text-red-500">
                <XCircle className="h-4 w-4 inline mr-2" /> No
              </TableCell>
              <TableCell className="text-green-500">
                <CheckCircle className="h-4 w-4 inline mr-2" /> Yes
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Booking approval workflow</TableCell>
              <TableCell className="text-red-500">
                <XCircle className="h-4 w-4 inline mr-2" /> Missing
              </TableCell>
              <TableCell className="text-green-500">
                <CheckCircle className="h-4 w-4 inline mr-2" /> Implemented
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Location selection</TableCell>
              <TableCell className="text-yellow-500">Limited</TableCell>
              <TableCell className="text-green-500">
                <CheckCircle className="h-4 w-4 inline mr-2" /> Full support
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Data connectivity</TableCell>
              <TableCell className="text-red-500">
                <XCircle className="h-4 w-4 inline mr-2" /> Disconnected
              </TableCell>
              <TableCell className="text-green-500">
                <CheckCircle className="h-4 w-4 inline mr-2" /> Fully connected
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
