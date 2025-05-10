"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NotificationItem } from "@/components/notification/notification-item"
import { useNotifications } from "@/lib/notification-context"
import { Check, Trash2 } from "lucide-react"

interface NotificationPanelProps {
  onClose: () => void
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAllAsRead, clearAllNotifications } = useNotifications()
  const [activeTab, setActiveTab] = useState<string>("all")

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "unread") return !notification.read
    return true
  })

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="mr-1 h-4 w-4" />
            Mark all read
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAllNotifications} disabled={notifications.length === 0}>
            <Trash2 className="mr-1 h-4 w-4" />
            Clear all
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <div className="border-b px-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">
              All
              <span className="ml-1 text-xs text-muted-foreground">({notifications.length})</span>
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              <span className="ml-1 text-xs text-muted-foreground">({unreadCount})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="flex-1 p-0">
          <NotificationList notifications={filteredNotifications} onClose={onClose} />
        </TabsContent>

        <TabsContent value="unread" className="flex-1 p-0">
          <NotificationList notifications={filteredNotifications} onClose={onClose} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NotificationList({
  notifications,
  onClose,
}: {
  notifications: Array<any>
  onClose: () => void
}) {
  if (notifications.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">No notifications to display</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="divide-y">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} onClose={onClose} />
        ))}
      </div>
    </ScrollArea>
  )
}
