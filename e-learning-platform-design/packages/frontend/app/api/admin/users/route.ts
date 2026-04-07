import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log('[ADMIN API] GET /api/admin/users - fetching users')
    
    // Get user info from headers (sent from client)
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")
    
    console.log('[ADMIN API] Auth check - userId:', userId, 'role:', userRole)
    
    // Check if user is admin
    if (!userId || userRole !== "admin") {
      console.warn('[ADMIN API] Unauthorized access attempt')
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log('[ADMIN API] Fetching users from database...')
    
    // Try with all fields first
    let users
    try {
      users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          bio: true,
          isVerified: true,
          isActive: true,
          violationCount: true,
          lastViolationAt: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' }
      })
    } catch (selectError) {
      console.error('[ADMIN API] Error with select, trying without new fields:', selectError)
      // Fallback: fetch without the new fields
      users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' }
      })
    }

    console.log('[ADMIN API] Successfully fetched', users.length, 'users')
    return NextResponse.json(users)
  } catch (error) {
    // Prisma error message jika ada, tampilkan ke client untuk debug
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : ''
    
    console.error('[ADMIN API] Error fetching users:', errorMessage)
    console.error('[ADMIN API] Stack trace:', errorStack)
    
    return NextResponse.json({ 
      error: "Failed to fetch users",
      message: errorMessage,
      details: errorStack 
    }, { status: 500 })
  }
}