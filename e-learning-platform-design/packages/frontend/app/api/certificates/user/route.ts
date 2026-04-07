import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const courseId = searchParams.get("courseId")

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "userId and courseId are required" },
        { status: 400 }
      )
    }

    console.log(`[CERT] Searching for certificate: userId=${userId}, courseId=${courseId}`)

    // Find certificate for this user and course
    const certificate = await prisma.certificate.findFirst({
      where: {
        userId: userId,
        courseId: courseId,
      },
      include: {
        user: true,
        course: true,
      },
    })

    console.log(`[CERT] Found certificate:`, certificate ? certificate.id : "NOT FOUND")

    if (!certificate) {
      return NextResponse.json(null)
    }

    return NextResponse.json(certificate)
  } catch (error) {
    console.error("[CERT] Error fetching certificate:", error)
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    )
  }
}

