"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/lib/notification-context"

interface NotificationBellProps {
  onClick: () => void
}

export function NotificationBell({ onClick }: NotificationBellProps) {
  const { unreadCount } = useNotifications()

  return (
    <Button variant="ghost" size="icon" onClick={onClick} className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
      <span className="sr-only">Notifications</span>
    </Button>
  )
}
