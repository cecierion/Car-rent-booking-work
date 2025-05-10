"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { addCar } from "@/lib/server-actions"
import type { Location } from "@/lib/types"

interface AddCarFormProps {
    locations: Location[]
}

export function AddCarForm({ locations }: AddCarFormProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const form = e.currentTarget
            const formData = new FormData(form)

            // Form validation
            const make = formData.get("make") as string
            const model = formData.get("model") as string
            const year = parseInt(formData.get("year") as string)
            const transmission = formData.get("transmission") as string
            const fuelType = formData.get("fuelType") as string
            const seats = parseInt(formData.get("seats") as string)
            const pricePerDay = parseFloat(formData.get("pricePerDay") as string)
            const locationId = formData.get("locationId") as string
            const image = formData.get("image") as File

            // Validate required fields
            if (!make || !model || !year || !transmission || !fuelType || !seats || !pricePerDay || !locationId) {
                throw new Error("Please fill in all required fields")
            }

            // Validate year
            const currentYear = new Date().getFullYear()
            if (year < 1900 || year > currentYear + 1) {
                throw new Error("Please enter a valid year")
            }

            // Validate seats
            if (seats < 1 || seats > 10) {
                throw new Error("Number of seats must be between 1 and 10")
            }

            // Validate price
            if (pricePerDay <= 0) {
                throw new Error("Price per day must be greater than 0")
            }

            // Handle image upload
            if (image && image.size > 0) {
                // In a real app, you would upload the image to a storage service
                // For now, we'll use a data URL
                const reader = new FileReader()
                reader.onloadend = async () => {
                    formData.set("image", reader.result as string)
                    await submitForm(formData)
                }
                reader.readAsDataURL(image)
            } else {
                await submitForm(formData)
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to add car",
                variant: "destructive",
            })
            setIsLoading(false)
        }
    }

    const submitForm = async (formData: FormData) => {
        try {
            const result = await addCar(formData)
            if (result.success) {
                toast({
                    title: "Success",
                    description: "Car has been added to the fleet",
                })
                router.push("/admin/fleet")
            } else {
                throw new Error("Failed to add car")
            }
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="make">Make *</Label>
                    <Input id="make" name="make" required placeholder="e.g., Toyota" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input id="model" name="model" required placeholder="e.g., Camry" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input
                        id="year"
                        name="year"
                        type="number"
                        required
                        min={1900}
                        max={new Date().getFullYear() + 1}
                        placeholder="e.g., 2024"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission *</Label>
                    <Select name="transmission" required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select transmission type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="automatic">Automatic</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="cvt">CVT</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type *</Label>
                    <Select name="fuelType" required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="gasoline">Gasoline</SelectItem>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="electric">Electric</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="seats">Number of Seats *</Label>
                    <Input
                        id="seats"
                        name="seats"
                        type="number"
                        required
                        min={1}
                        max={10}
                        placeholder="e.g., 5"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="pricePerDay">Price per Day ($) *</Label>
                    <Input
                        id="pricePerDay"
                        name="pricePerDay"
                        type="number"
                        required
                        min={0}
                        step={0.01}
                        placeholder="e.g., 50.00"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="locationId">Location *</Label>
                    <Select name="locationId" required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                            {locations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>
                                    {location.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter car description..."
                    className="min-h-[100px]"
                />
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="image">Car Image</Label>
                    <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                {imagePreview && (
                    <div className="rounded-lg overflow-hidden w-full max-w-md">
                        <img src={imagePreview} alt="Preview" className="w-full h-auto" />
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/fleet")}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding Car..." : "Add Car"}
                </Button>
            </div>
        </form>
    )
} 