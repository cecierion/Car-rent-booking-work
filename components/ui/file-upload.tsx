"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  value?: string
  onChange: (url: string) => void
  onError?: (error: string) => void
  className?: string
  accept?: string
  maxSizeMB?: number
}

export function FileUpload({
  value,
  onChange,
  onError,
  className,
  accept = "image/*",
  maxSizeMB = 5,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      onError?.(`File size exceeds ${maxSizeMB}MB limit`)
      return
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    try {
      setIsUploading(true)

      // Upload the file
      const uploadedUrl = await uploadImage(file)

      // Update the value
      onChange(uploadedUrl)
    } catch (error) {
      console.error("Upload failed:", error)
      onError?.("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={isUploading}
      />

      {!preview ? (
        <div
          onClick={triggerFileInput}
          className="flex flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-6 cursor-pointer hover:border-gray-400 transition-colors"
        >
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">Click to upload an image</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to {maxSizeMB}MB</p>
        </div>
      ) : (
        <div className="relative rounded-md overflow-hidden border border-gray-200">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover" />

          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-md p-4 flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-medium">Uploading...</span>
              </div>
            </div>
          )}

          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove image</span>
          </Button>
        </div>
      )}
    </div>
  )
}

// Simulated image upload function
// In a real app, this would upload to a service like Vercel Blob, AWS S3, etc.
async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      try {
        // Create a persistent object URL for demo purposes
        // In a real app, this would be the URL returned by the upload service
        const reader = new FileReader()
        reader.onload = () => {
          // Use data URL as the "uploaded" URL for demo purposes
          resolve(reader.result as string)
        }
        reader.onerror = () => {
          reject(new Error("Failed to read file"))
        }
        reader.readAsDataURL(file)
      } catch (error) {
        reject(error)
      }
    }, 1500) // Simulate 1.5s upload time
  })
}
