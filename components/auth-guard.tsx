"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    // Check authentication status
    const authStatus = isAuthenticated()
    if (!authStatus) {
      router.push("/admin/login")
    } else {
      setIsAuthed(true)
    }
    setIsChecking(false)
  }, [router])

  // Show nothing while checking authentication
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  // If authenticated, show the children
  if (isAuthed) {
    return <>{children}</>
  }

  // This will briefly show before redirect happens
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecting to login...</p>
    </div>
  )
}
