import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get user info from headers (sent from client)
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")
    
    // Check if user is admin
    if (!userId || userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch stats from database
    const [allUsers, allCourses, allEnrollments, allPayments] = await Promise.all([
      prisma.user.findMany(),
      prisma.course.findMany(),
      prisma.enrollment.findMany(),
      prisma.payment.findMany({
        where: {
          status: "completed"
        }
      })
    ])

    // Calculate total revenue from completed payments
    const totalRevenue = allPayments.reduce((sum, payment) => sum + payment.amount, 0)

    const stats = {
      totalUsers: allUsers.length,
      totalCourses: allCourses.length,
      totalEnrollments: allEnrollments.length,
      totalRevenue,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}