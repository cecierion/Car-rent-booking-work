"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useNotifications } from "@/lib/notification-context"
import type { Notification } from "@/lib/types"

export function NotificationTestPanel() {
  const { addNotification } = useNotifications()
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState<Notification["type"]>("new_booking")
  const [priority, setPriority] = useState<Notification["priority"]>("medium")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !message) return

    addNotification({
      title,
      message,
      type,
      priority,
    })

    // Reset form
    setTitle("")
    setMessage("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Notifications</CardTitle>
        <CardDescription>Create test notifications to see how they appear</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Notification Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Notification Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Notification Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as Notification["type"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_booking">New Booking</SelectItem>
                  <SelectItem value="booking_update">Booking Update</SelectItem>
                  <SelectItem value="booking_cancelled">Booking Cancelled</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="customer_update">Customer Update</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Notification["priority"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Send Test Notification
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
