import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Get admin verification from headers
    const adminId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")
    
    console.log('[PATCH /api/admin/users/[userId]] Admin:', adminId, 'Role:', userRole)
    
    if (!adminId || userRole !== "admin") {
      console.log('[PATCH /api/admin/users/[userId]] Unauthorized - missing admin role')
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId } = await params
    const body = await request.json()
    const { action, reason, ...updateData } = body
    
    console.log(`[PATCH /api/admin/users/[userId]] Action: ${action} on user: ${userId}`)

    let updatedUser

    switch (action) {
      case "verify":
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isVerified: true },
        })
        console.log(`[PATCH /api/admin/users/[userId]] User ${userId} verified`)
        break

      case "activate":
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isActive: true },
        })
        console.log(`[PATCH /api/admin/users/[userId]] User ${userId} activated`)
        break

      case "deactivate":
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isActive: false },
        })
        console.log(`[PATCH /api/admin/users/[userId]] User ${userId} deactivated`)
        break

      case "approve":
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isApproved: true },
        })
        console.log(`[PATCH /api/admin/users/[userId]] User ${userId} approved`)
        break

      case "reject":
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isApproved: false, isActive: false },
        })
        console.log(`[PATCH /api/admin/users/[userId]] User ${userId} rejected. Reason: ${reason}`)
        break

      case "violation":
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Update user violation count
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            violationCount: (user.violationCount || 0) + 1,
            lastViolationAt: new Date(),
          },
        })
        console.log(`[PATCH /api/admin/users/[userId]] Violation recorded for user ${userId}. Count: ${updatedUser.violationCount}. Reason: ${reason}`)
        break

      default:
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: updateData,
        })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Get admin verification from headers
    const adminId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")
    
    console.log('[DELETE /api/admin/users/[userId]] Admin:', adminId, 'Role:', userRole)
    
    if (!adminId || userRole !== "admin") {
      console.log('[DELETE /api/admin/users/[userId]] Unauthorized - missing admin role')
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId } = await params
    console.log(`[DELETE /api/admin/users/[userId]] Deleting user: ${userId}`)

    // Get user details before deletion for audit log
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    })

    console.log(`[DELETE /api/admin/users/[userId]] User ${userToDelete.name} (${userToDelete.email}) deleted successfully`)

    return NextResponse.json({ success: true, message: `User ${userToDelete.name} deleted successfully` })
  } catch (error: any) {
    console.error("Error deleting user:", error)
    
    // Handle foreign key constraint errors
    if (error.code === "P2014" || error.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot delete user: User has related data (courses, enrollments, etc.). Please remove those first." },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}

