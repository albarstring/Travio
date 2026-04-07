import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET all quizzes for a course
export async function GET(request: NextRequest) {
  try {
    const courseId = request.nextUrl.searchParams.get('courseId')
    
    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 })
    }

    const quizzes = await prisma.quiz.findMany({
      where: { courseId },
      include: {
        questions: {
          include: {
            answers: true
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(quizzes)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST create new quiz
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { courseId, title, description, passingScore, order } = body

    if (!courseId || !title) {
      return NextResponse.json({ error: "courseId and title are required" }, { status: 400 })
    }

    const quiz = await prisma.quiz.create({
      data: {
        courseId,
        title,
        description,
        passingScore: passingScore || 70,
        order: order || 0,
        isPublished: false
      },
      include: {
        questions: {
          include: {
            answers: true
          }
        }
      }
    })

    return NextResponse.json(quiz, { status: 201 })
  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
