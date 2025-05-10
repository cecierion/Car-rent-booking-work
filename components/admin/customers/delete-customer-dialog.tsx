"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Customer } from "@/lib/types"

interface DeleteCustomerDialogProps {
  customer: Customer | null
  isOpen: boolean
  onClose: () => void
  onDelete: (customerId: string) => void
}

export function DeleteCustomerDialog({ customer, isOpen, onClose, onDelete }: DeleteCustomerDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!customer) return

    setIsLoading(true)
    try {
      // In a real app, you would make an API call here
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      onDelete(customer.id)
    } finally {
      setIsLoading(false)
      onClose()
    }
  }

  if (!customer) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the customer account for <strong>{customer.name}</strong> and remove all their
            data from the system. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
            {isLoading ? "Deleting..." : "Delete Customer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
