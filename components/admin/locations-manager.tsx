"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useData } from "@/lib/data-context"
import { Trash2, Plus } from "lucide-react"

interface LocationsManagerProps {
  isOpen: boolean
  onClose: () => void
}

export function LocationsManager({ isOpen, onClose }: LocationsManagerProps) {
  const { locations, cars, addLocation, deleteLocation } = useData()
  const [newLocationName, setNewLocationName] = useState("")
  const [newLocationAddress, setNewLocationAddress] = useState("")
  const [newLocationCity, setNewLocationCity] = useState("")
  const [newLocationState, setNewLocationState] = useState("")
  const [newLocationZip, setNewLocationZip] = useState("")
  const [newLocationCountry, setNewLocationCountry] = useState("USA")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLocationName.trim()) {
      setError("Location name is required")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Create a new location object
      const newLocation = {
        id: `loc-${Date.now()}`,
        name: newLocationName.trim(),
        address: newLocationAddress.trim(),
        city: newLocationCity.trim(),
        state: newLocationState.trim(),
        zipCode: newLocationZip.trim(),
        country: newLocationCountry.trim(),
      }

      // Add the location
      addLocation(newLocation)

      // Reset form
      setNewLocationName("")
      setNewLocationAddress("")
      setNewLocationCity("")
      setNewLocationState("")
      setNewLocationZip("")
      setNewLocationCountry("USA")
    } catch (err) {
      setError("Failed to add location")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteLocation = (locationId: string) => {
    // Check if any cars are using this location
    const carsUsingLocation = cars.filter((car) => car.locationId === locationId)

    if (carsUsingLocation.length > 0) {
      alert(
        `Cannot delete this location because ${carsUsingLocation.length} cars are assigned to it. Please reassign these cars first.`,
      )
      return
    }

    deleteLocation(locationId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Pickup Locations</DialogTitle>
          <DialogDescription>Add, edit, or remove pickup locations for your rental cars.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddLocation} className="space-y-4 my-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location-name">Location Name*</Label>
              <Input
                id="location-name"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder="Enter location name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-address">Address</Label>
              <Input
                id="location-address"
                value={newLocationAddress}
                onChange={(e) => setNewLocationAddress(e.target.value)}
                placeholder="Street address"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location-city">City</Label>
              <Input
                id="location-city"
                value={newLocationCity}
                onChange={(e) => setNewLocationCity(e.target.value)}
                placeholder="City"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-state">State</Label>
              <Input
                id="location-state"
                value={newLocationState}
                onChange={(e) => setNewLocationState(e.target.value)}
                placeholder="State"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-zip">Zip Code</Label>
              <Input
                id="location-zip"
                value={newLocationZip}
                onChange={(e) => setNewLocationZip(e.target.value)}
                placeholder="Zip code"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location-country">Country</Label>
            <Input
              id="location-country"
              value={newLocationCountry}
              onChange={(e) => setNewLocationCountry(e.target.value)}
              placeholder="Country"
            />
          </div>

          <Button type="submit" disabled={isSubmitting || !newLocationName.trim()} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Location
          </Button>
        </form>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Cars Assigned</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No locations added yet
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((location) => {
                  const carsCount = cars.filter((car) => car.locationId === location.id).length
                  const address = [location.city, location.state].filter(Boolean).join(", ")

                  return (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>{address || "No address"}</TableCell>
                      <TableCell>{carsCount}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteLocation(location.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
