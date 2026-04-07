"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear auth session from localStorage and cookies
    logout()
    
    // Also make request to logout API to clear server-side cookies
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {})
    
    router.push("/")
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Logging out...</p>
    </div>
  )
}
