"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChevronLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminReportsPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentSession = getSession()
    setSession(currentSession)

    if (!currentSession || currentSession.role !== "admin") {
      router.push("/login")
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || session.role !== "admin") {
    return null
  }

  // Mock report data
  const enrollmentGrowth = [
    { month: "Jan", enrollments: 120 },
    { month: "Feb", enrollments: 180 },
    { month: "Mar", enrollments: 240 },
    { month: "Apr", enrollments: 320 },
    { month: "May", enrollments: 420 },
    { month: "Jun", enrollments: 540 },
  ]

  const completionRate = [
    { month: "Jan", completion: 45 },
    { month: "Feb", completion: 52 },
    { month: "Mar", completion: 58 },
    { month: "Apr", completion: 62 },
    { month: "May", completion: 68 },
    { month: "Jun", completion: 72 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      <main className="md:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
              <p className="text-muted-foreground">Platform statistics and insights</p>
        </div>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enrollment Growth */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-6">Enrollment Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={enrollmentGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="enrollments" fill="#3b82f6" stroke="#3b82f6" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Completion Rate */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-6">Completion Rate (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={completionRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completion" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6">
            <h4 className="text-sm text-muted-foreground mb-2">Platform Health Score</h4>
            <p className="text-4xl font-bold">94%</p>
            <p className="text-xs text-green-600 mt-2">Up 5% from last month</p>
          </Card>

          <Card className="p-6">
            <h4 className="text-sm text-muted-foreground mb-2">Avg. Course Rating</h4>
            <p className="text-4xl font-bold">4.7</p>
            <p className="text-xs text-green-600 mt-2">⭐ Based on 500+ reviews</p>
          </Card>

          <Card className="p-6">
            <h4 className="text-sm text-muted-foreground mb-2">Student Satisfaction</h4>
            <p className="text-4xl font-bold">89%</p>
            <p className="text-xs text-green-600 mt-2">Would recommend</p>
          </Card>
        </div>
        </div>
      </main>
    </div>
  )
}
