import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSessionServer } from "@/lib/auth-server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionServer()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { action, notes } = body

    const course = await prisma.course.findUnique({ where: { id } })
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const updateData: any = {
      status: action === "approve" ? "approved" : "rejected",
      reviewedBy: session.userId,
      reviewedAt: new Date(),
    }

    if (notes) {
      updateData.adminNotes = notes
    }

    if (action === "approve") {
      updateData.isPublished = true
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action,
        entityType: "course",
        entityId: id,
        adminId: session.userId,
        details: { notes, status: updateData.status },
      },
    })

    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error("Error reviewing course:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

