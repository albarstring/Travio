import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// PUT reorder sections
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sectionId } = await params
    const body = await request.json()
    const { newOrder } = body

    if (newOrder === undefined || newOrder === null) {
      return NextResponse.json({ error: "newOrder is required" }, { status: 400 })
    }

    const section = await prisma.section.update({
      where: { id: sectionId },
      data: { order: parseInt(newOrder) },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error reordering section:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

