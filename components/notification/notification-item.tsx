"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Check, X, Bell, Calendar, AlertCircle, CreditCard, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/lib/notification-context"
import type { Notification } from "@/lib/types"

interface NotificationItemProps {
  notification: Notification
  onClose?: () => void
}

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const router = useRouter()
  const { markAsRead, clearNotification } = useNotifications()

  const handleClick = () => {
    markAsRead(notification.id)
    if (notification.linkTo) {
      if (onClose) onClose()
      router.push(notification.linkTo)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    clearNotification(notification.id)
  }

  const getIcon = () => {
    switch (notification.type) {
      case "new_booking":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "booking_update":
        return <Check className="h-5 w-5 text-green-500" />
      case "booking_cancelled":
        return <X className="h-5 w-5 text-red-500" />
      case "payment":
        return <CreditCard className="h-5 w-5 text-purple-500" />
      case "customer_update":
        return <User className="h-5 w-5 text-orange-500" />
      case "system":
        return <AlertCircle className="h-5 w-5 text-gray-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityClass = () => {
    switch (notification.priority) {
      case "high":
        return "border-l-4 border-red-500"
      case "medium":
        return "border-l-4 border-yellow-500"
      case "low":
        return "border-l-4 border-green-500"
      default:
        return ""
    }
  }

  return (
    <div
      className={cn(
        "flex cursor-pointer items-start gap-3 p-4 hover:bg-muted/50",
        !notification.read && "bg-muted/30",
        getPriorityClass(),
      )}
      onClick={handleClick}
    >
      <div className="mt-1 flex-shrink-0">{getIcon()}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>{notification.title}</p>
          <button
            onClick={handleClear}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            aria-label="Dismiss notification"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
        </p>
      </div>
    </div>
  )
}
