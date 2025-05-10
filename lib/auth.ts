"use client"

// Simple auth helper functions for client components
export function loginAdmin(email: string, password: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === "admin@example.com" && password === "admin123") {
        localStorage.setItem("car_rental_admin_auth", "authenticated")
        resolve(true)
      } else {
        resolve(false)
      }
    }, 500)
  })
}

export function logoutAdmin(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("car_rental_admin_auth")
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("car_rental_admin_auth") === "authenticated"
}
