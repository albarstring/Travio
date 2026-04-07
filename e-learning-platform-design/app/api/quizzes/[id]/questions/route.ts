import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// POST add question to quiz
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params
    const body = await request.json()
    const { title, description, type, order, answers } = body

    if (!title || !type) {
      return NextResponse.json(
        { error: "title and type are required" },
        { status: 400 }
      )
    }

    // Create question
    const question = await prisma.quizQuestion.create({
      data: {
        quizId,
        title,
        description,
        type,
        order: order || 0
      }
    })

    // Create answers if provided
    if (answers && Array.isArray(answers) && answers.length > 0) {
      await prisma.quizAnswer.createMany({
        data: answers.map((answer: any, index: number) => ({
          questionId: question.id,
          text: answer.text,
          isCorrect: answer.isCorrect || false,
          order: answer.order || index
        }))
      })
    }

    const updatedQuestion = await prisma.quizQuestion.findUnique({
      where: { id: question.id },
      include: { answers: true }
    })

    return NextResponse.json(updatedQuestion, { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
