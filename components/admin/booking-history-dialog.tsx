"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { BookingHistory } from "@/lib/types"

interface BookingHistoryDialogProps {
  bookingId: string
  history: BookingHistory[]
  isOpen: boolean
  onClose: () => void
}

export function BookingHistoryDialog({ bookingId, history, isOpen, onClose }: BookingHistoryDialogProps) {
  const filteredHistory = history.filter((item) => item.bookingId === bookingId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Booking History</DialogTitle>
          <DialogDescription>View the history of changes for this booking.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {filteredHistory.length === 0 ? (
            <p className="text-center text-gray-500">No history available for this booking.</p>
          ) : (
            <div className="relative space-y-6">
              {filteredHistory.map((item, index) => (
                <div key={index} className="relative pl-6">
                  {index < filteredHistory.length - 1 && (
                    <div className="absolute left-2 top-3 h-full w-0.5 -translate-x-1/2 bg-gray-200" />
                  )}
                  <div className="absolute left-0 top-3 h-4 w-4 rounded-full border-2 border-primary bg-background" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.action}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {format(new Date(item.timestamp), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                    {item.reason && <p className="text-sm italic">"{item.reason}"</p>}
                    {item.changes && (
                      <div className="mt-2 rounded-md bg-gray-50 p-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(item.changes).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span>{" "}
                              {typeof value === "object" ? (
                                <>
                                  <span className="line-through">{value.from}</span> → {value.to}
                                </>
                              ) : (
                                value
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
