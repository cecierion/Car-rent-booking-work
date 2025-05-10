"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if user is authenticated on client-side
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const isAuthenticated = localStorage.getItem("car_rental_admin_auth") === "authenticated"
        setIsAdmin(isAuthenticated)
      }
    }

    checkAuth()

    // Set up event listener for storage changes (in case user logs in/out in another tab)
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex flex-col items-center">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-primary">M</span>
              <span className="text-2xl font-bold text-primary ml-1">F</span>
            </div>
            <span className="text-xs text-gray-500">Since 2022</span>
          </div>
          <span className="font-bold text-gray-800">AUTOSHOP</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
          <Link href="/#cars" className="text-sm font-medium transition-colors hover:text-primary">
            Fleet
          </Link>
          <Link href="/blog" className="text-sm font-medium transition-colors hover:text-primary">
            Blog
          </Link>
          <Button asChild variant="outline">
            <Link href={isAdmin ? "/admin" : "/admin/login"}>{isAdmin ? "Admin Dashboard" : "Admin Login"}</Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <div className="flex flex-col gap-6 pt-6">
              <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/#cars"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Fleet
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
              <Button asChild variant="outline">
                <Link href={isAdmin ? "/admin" : "/admin/login"} onClick={() => setIsOpen(false)}>
                  {isAdmin ? "Admin Dashboard" : "Admin Login"}
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
