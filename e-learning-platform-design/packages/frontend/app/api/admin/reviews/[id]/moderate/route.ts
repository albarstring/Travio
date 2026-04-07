import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")
    
    if (!userId || userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { action, note } = body

    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        isModerated: true,
        isApproved: action === "approve",
        moderatedBy: userId,
        moderatedAt: new Date(),
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: `moderate_${action}`,
        entityType: "review",
        entityId: id,
        adminId: userId,
        details: { note, approved: action === "approve" },
      },
    })

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error("Error moderating review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
