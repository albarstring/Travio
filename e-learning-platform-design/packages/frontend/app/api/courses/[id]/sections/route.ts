import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET all sections for a course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params

    const sections = await prisma.section.findMany({
      where: { courseId },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(sections)
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST create new section
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params
    const body = await request.json()
    const { title, description, isPreview } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Get the highest order for this course
    const lastSection = await prisma.section.findFirst({
      where: { courseId },
      orderBy: { order: 'desc' }
    })

    const order = lastSection ? lastSection.order + 1 : 1

    const section = await prisma.section.create({
      data: {
        courseId,
        title,
        description: description || null,
        isPreview: isPreview || false,
        order,
      },
      include: {
        lessons: true
      }
    })

    return NextResponse.json(section, { status: 201 })
  } catch (error) {
    console.error('Error creating section:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

