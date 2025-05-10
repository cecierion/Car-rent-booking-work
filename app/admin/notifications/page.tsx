"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminHeader } from "@/components/admin-header"
import { AuthGuard } from "@/components/auth-guard"
import { NotificationTestPanel } from "@/components/admin/notification-test-panel"
import { useNotifications } from "@/lib/notification-context"
import { Calendar, Check, X, Bell, CreditCard, User, AlertCircle, Search, Trash2 } from "lucide-react"

export default function NotificationsPage() {
  return (
    <AuthGuard>
      <NotificationsContent />
    </AuthGuard>
  )
}

function NotificationsContent() {
  const { notifications, markAllAsRead, clearAllNotifications } = useNotifications()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get icon based on notification type
  const getIcon = (type: string) => {
    switch (type) {
      case "new_booking":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "booking_update":
        return <Check className="h-4 w-4 text-green-500" />
      case "booking_cancelled":
        return <X className="h-4 w-4 text-red-500" />
      case "payment":
        return <CreditCard className="h-4 w-4 text-purple-500" />
      case "customer_update":
        return <User className="h-4 w-4 text-orange-500" />
      case "system":
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  // Get badge variant based on priority
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge>Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">Low</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <div className="container mx-auto p-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Notification Management</CardTitle>
                  <CardDescription>View and manage system notifications</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={markAllAsRead} disabled={notifications.length === 0}>
                    <Check className="mr-2 h-4 w-4" />
                    Mark all read
                  </Button>
                  <Button variant="outline" onClick={clearAllNotifications} disabled={notifications.length === 0}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear all
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNotifications.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No notifications found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredNotifications.map((notification) => (
                          <TableRow key={notification.id}>
                            <TableCell>{getIcon(notification.type)}</TableCell>
                            <TableCell className="font-medium">{notification.title}</TableCell>
                            <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                            <TableCell>{format(new Date(notification.timestamp), "MMM d, h:mm a")}</TableCell>
                            <TableCell>{getPriorityBadge(notification.priority)}</TableCell>
                            <TableCell>
                              {notification.read ? (
                                <Badge variant="outline" className="bg-muted">
                                  Read
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Unread</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <NotificationTestPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
