import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// POST submit quiz attempt (start or complete)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, quizId, responses, completed } = body

    if (!userId || !quizId) {
      return NextResponse.json(
        { error: "userId and quizId are required" },
        { status: 400 }
      )
    }

    // Get quiz with all questions and answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            answers: true
          }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    let attempt = await prisma.quizAttempt.findUnique({
      where: { userId_quizId: { userId, quizId } }
    })

    if (!attempt) {
      // Create new attempt
      attempt = await prisma.quizAttempt.create({
        data: {
          userId,
          quizId,
          responses: responses || {}
        }
      })
    } else if (responses) {
      // Update existing attempt with responses
      attempt = await prisma.quizAttempt.update({
        where: { id: attempt.id },
        data: {
          responses
        }
      })
    }

    // If completed, calculate score
    if (completed && responses) {
      let earnedPoints = 0
      let totalPoints = 0

      // Calculate score based on correct answers
      quiz.questions.forEach((question: any) => {
        totalPoints += 1

        const userAnswer = (responses as any)[question.id]
        if (!userAnswer) return

        const selectedAnswer = question.answers.find((a: any) => a.id === userAnswer)
        if (selectedAnswer?.isCorrect) {
          earnedPoints += 1
        }
      })

      const score = Math.round((earnedPoints / totalPoints) * 100)
      const passed = score >= quiz.passingScore

      attempt = await prisma.quizAttempt.update({
        where: { id: attempt.id },
        data: {
          score,
          earnedPoints,
          totalPoints,
          passed,
          completedAt: new Date()
        }
      })
    }

    return NextResponse.json(attempt, { status: 201 })
  } catch (error) {
    console.error('Error submitting quiz attempt:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET user's quiz attempt
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    const quizId = request.nextUrl.searchParams.get('quizId')

    if (!userId || !quizId) {
      return NextResponse.json(
        { error: "userId and quizId are required" },
        { status: 400 }
      )
    }

    const attempt = await prisma.quizAttempt.findUnique({
      where: { userId_quizId: { userId, quizId } }
    })

    return NextResponse.json(attempt || null)
  } catch (error) {
    console.error('Error fetching quiz attempt:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
