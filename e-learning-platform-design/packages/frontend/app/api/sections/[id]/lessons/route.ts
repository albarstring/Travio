import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET all lessons in a section
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sectionId } = await params

    const lessons = await prisma.lesson.findMany({
      where: { sectionId },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(lessons)
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST create new lesson in section
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sectionId } = await params
    const body = await request.json()
    const { title, description, videoUrl, duration, content, isPreview } = body

    if (!title || !description || !videoUrl || !duration) {
      return NextResponse.json(
        { error: "Title, description, videoUrl, and duration are required" },
        { status: 400 }
      )
    }

    // Get the highest order for this section
    const lastLesson = await prisma.lesson.findFirst({
      where: { sectionId },
      orderBy: { order: 'desc' }
    })

    const order = lastLesson ? lastLesson.order + 1 : 1

    const lesson = await prisma.lesson.create({
      data: {
        sectionId,
        title,
        description,
        videoUrl,
        duration: parseInt(duration),
        content: content || null,
        isPreview: isPreview || false,
        order,
      }
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

