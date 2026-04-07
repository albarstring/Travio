"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/auth"
import { UsersList } from "./users-list"
import { Navbar } from "@/components/navbar"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminUsersPage() {
  const router = useRouter()

  useEffect(() => {
    const session = getSession()
    if (!session || session.role !== "admin") {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      <main className="md:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage users, instructors, and account permissions</p>
        </div>
        <UsersList />
        </div>
      </main>
    </div>
  )
}
