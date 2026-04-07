"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, CartesianGrid } from "recharts"
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  AlertCircle, 
  LogOut, 
  Home,
  DollarSign,
  FileText,
  CheckCircle2,
  Clock,
  Activity,
  Award,
  ShoppingCart,
  Eye,
  Tag
} from "lucide-react"
import { getSession, logout } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getAuthHeaders } from "@/lib/api-helpers"

export default function AdminDashboard() {
  const router = useRouter()
  const [session, setSession] = useState(getSession())
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = () => {
      const currentSession = getSession()
      setSession(currentSession)

      if (!currentSession) {
        router.push("/login")
        return
      }

      if (currentSession.role !== "admin") {
        router.push("/dashboard")
        return
      }

      const fetchStats = async () => {
        try {
          const headers = getAuthHeaders()
          const response = await fetch('/api/admin/stats', {
            headers
          })
          if (response.ok) {
          const data = await response.json()
          setStats(data)
          } else {
            console.error('Failed to fetch stats:', response.status, response.statusText)
          }
        } catch (error) {
          console.error('Error fetching stats:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchStats()
    }

    checkSession()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || session.role !== "admin") {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Mock data for charts
  const userRoleData = [
    { name: "Students", value: 320, fill: "#3b82f6" },
    { name: "Instructors", value: 45, fill: "#8b5cf6" },
    { name: "Admins", value: 3, fill: "#ef4444" },
  ]

  const revenueData = [
    { month: "Jan", revenue: 12400 },
    { month: "Feb", revenue: 13480 },
    { month: "Mar", revenue: 15200 },
    { month: "Apr", revenue: 17100 },
    { month: "May", revenue: 19400 },
    { month: "Jun", revenue: 22500 },
  ]

  const categoryDistribution = [
    { name: "Web Dev", value: 28 },
    { name: "Mobile", value: 15 },
    { name: "Data Science", value: 12 },
    { name: "Design", value: 8 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />

      <main className="md:pl-64 bg-muted/30 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Platform overview, statistics & management</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="font-semibold text-sm">{session?.name || "Admin"}</p>
            </div>
          </div>
        </div>

        {/* Key Stats Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Total Users */}
          <Card className="p-4 sm:p-5 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">Total Users</p>
                <p className="text-2xl sm:text-3xl font-bold">{stats.totalUsers}</p>
                <p className="text-xs text-blue-600 mt-2">Active on platform</p>
              </div>
              <div className="bg-blue-500/15 p-2.5 sm:p-3 rounded-lg ml-2">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          {/* Total Courses */}
          <Card className="p-4 sm:p-5 hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">Total Courses</p>
                <p className="text-2xl sm:text-3xl font-bold">{stats.totalCourses}</p>
                <p className="text-xs text-purple-600 mt-2">Active courses</p>
              </div>
              <div className="bg-purple-500/15 p-2.5 sm:p-3 rounded-lg ml-2">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          {/* Total Revenue */}
          <Card className="p-4 sm:p-5 hover:shadow-md transition-shadow border-l-4 border-l-green-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">Total Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold">${(stats.totalRevenue / 1000).toFixed(1)}k</p>
                <p className="text-xs text-green-600 mt-2">All time earnings</p>
              </div>
              <div className="bg-green-500/15 p-2.5 sm:p-3 rounded-lg ml-2">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Total Enrollments */}
          <Card className="p-4 sm:p-5 hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">Enrollments</p>
                <p className="text-2xl sm:text-3xl font-bold">{stats.totalEnrollments}</p>
                <p className="text-xs text-orange-600 mt-2">Total signups</p>
              </div>
              <div className="bg-orange-500/15 p-2.5 sm:p-3 rounded-lg ml-2">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Revenue Trend Chart */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold">Revenue Trend</h3>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => `$${value}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* User Distribution Pie Chart */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold">User Distribution</h3>
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, fill }) => (
                    <text fontSize="12" fill={fill} textAnchor="middle">
                      {name}: {value}
                    </text>
                  )}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} users`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Category Distribution */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold">Courses by Category</h3>
              <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div className="space-y-4">
              {categoryDistribution.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{cat.name}</span>
                    <span className="text-xs sm:text-sm font-bold bg-primary/10 px-2 py-1 rounded">{cat.value}</span>
                  </div>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all" 
                      style={{ width: `${(cat.value / 40) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Import Tag icon if not imported */}
        </div>
      </main>
    </div>
  )
}
