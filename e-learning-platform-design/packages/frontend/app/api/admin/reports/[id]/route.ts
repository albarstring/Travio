import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PATCH(
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
    const { action, resolution } = body

    const report = await prisma.report.findUnique({ where: { id } })
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    const status = action === "resolve" ? "resolved" : "dismissed"
    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        status,
        reviewedBy: userId,
        reviewedAt: new Date(),
        resolution: resolution || null,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action,
        entityType: "report",
        entityId: id,
        adminId: userId,
        details: { resolution, status },
      },
    })

    return NextResponse.json(updatedReport)
  } catch (error) {
    console.error("Error updating report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
