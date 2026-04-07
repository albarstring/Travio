import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const courseId = searchParams.get("courseId")

  if (!courseId) {
    return NextResponse.json({ error: "Course ID required" }, { status: 400 })
  }

  const reviews = db.reviews.getByCourse(courseId)
  return NextResponse.json({ reviews })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { userId, courseId, rating, comment } = body

  if (!userId || !courseId || !rating || !comment) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
  }

  // In a real app, this would save to the database
  const newReview = {
    id: `review-${Date.now()}`,
    courseId,
    userId,
    rating,
    comment,
    user: db.users.findById(userId),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return NextResponse.json({ review: newReview }, { status: 201 })
}
