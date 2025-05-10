"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NotificationDropdown } from "@/components/notification/notification-dropdown"
import { logoutAdmin } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { LayoutDashboard, BarChart3, Users } from "lucide-react"

export function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logoutAdmin()
    router.push("/admin/login")
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Link href="/admin" className="text-xl font-bold text-gray-900 mr-6">
            Car Rental Admin
          </Link>
          <Link href="/admin">
            <Button variant={isActive("/admin") ? "default" : "ghost"} size="sm">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button variant={isActive("/admin/analytics") ? "default" : "ghost"} size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </Link>
          <Link href="/admin/customers">
            <Button variant={isActive("/admin/customers") ? "default" : "ghost"} size="sm">
              <Users className="h-4 w-4 mr-2" />
              Customers
            </Button>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationDropdown />
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
