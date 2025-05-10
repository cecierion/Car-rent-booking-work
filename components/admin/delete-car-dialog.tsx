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
import type { Car } from "@/lib/types"

interface DeleteCarDialogProps {
  car: Car | null
  isOpen: boolean
  onClose: () => void
  onDelete: (carId: string) => void
}

export function DeleteCarDialog({ car, isOpen, onClose, onDelete }: DeleteCarDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!car) return

    setIsLoading(true)
    try {
      // In a real app, you would make an API call here
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      onDelete(car.id)
    } finally {
      setIsLoading(false)
      onClose()
    }
  }

  if (!car) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the {car.make} {car.model} from your inventory. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
