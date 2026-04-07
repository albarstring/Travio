import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET single section
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sectionId } = await params

    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        },
        course: true
      }
    })

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 })
    }

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error fetching section:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT update section
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sectionId } = await params
    const body = await request.json()
    const { title, description, order, isPreview } = body

    const section = await prisma.section.update({
      where: { id: sectionId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description: description || null }),
        ...(order !== undefined && { order: parseInt(order) }),
        ...(isPreview !== undefined && { isPreview }),
      },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error updating section:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE section
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sectionId } = await params

    // Delete section (lessons will be cascade deleted)
    await prisma.section.delete({
      where: { id: sectionId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting section:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

