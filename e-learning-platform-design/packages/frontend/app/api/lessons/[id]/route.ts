import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET single lesson
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: {
          include: {
            course: true
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT update lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params
    const body = await request.json()
    const { title, description, videoUrl, duration, order, content, isPreview } = body

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(videoUrl && { videoUrl }),
        ...(duration !== undefined && { duration: parseInt(duration) }),
        ...(order !== undefined && { order: parseInt(order) }),
        ...(content !== undefined && { content: content || null }),
        ...(isPreview !== undefined && { isPreview }),
      },
      include: {
        section: true
      }
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Error updating lesson:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params

    await prisma.lesson.delete({
      where: { id: lessonId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

