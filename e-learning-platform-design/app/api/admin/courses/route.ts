import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSessionServer } from "@/lib/auth-server"

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionServer()
    console.log('[ADMIN COURSES] Session:', session ? `${session.email} (${session.role})` : 'No session')
    
    if (!session || session.role !== "admin") {
      console.log('[ADMIN COURSES] Unauthorized - not admin')
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "all"
    console.log('[ADMIN COURSES] Fetching courses with status filter:', status)

    const where: any = {}
    if (status !== "all") {
      where.status = status
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        sections: {
          include: {
            lessons: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: "desc" },
    })

    console.log('[ADMIN COURSES] Found courses:', courses.length)
    return NextResponse.json(courses)
  } catch (error) {
    console.error("[ADMIN COURSES] Error:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}

