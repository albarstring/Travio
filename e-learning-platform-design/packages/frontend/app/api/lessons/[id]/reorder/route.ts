import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// PUT reorder lessons
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params
    const body = await request.json()
    const { newOrder } = body

    if (newOrder === undefined || newOrder === null) {
      return NextResponse.json({ error: "newOrder is required" }, { status: 400 })
    }

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: { order: parseInt(newOrder) },
      include: {
        section: true
      }
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Error reordering lesson:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

