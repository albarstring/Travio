import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// PUT update answer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { text, isCorrect, order } = body

    const answer = await prisma.quizAnswer.update({
      where: { id },
      data: {
        ...(text && { text }),
        ...(isCorrect !== undefined && { isCorrect }),
        ...(order !== undefined && { order })
      }
    })

    return NextResponse.json(answer)
  } catch (error) {
    console.error('Error updating answer:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE answer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.quizAnswer.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting answer:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
