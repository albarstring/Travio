import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const courseId = searchParams.get('courseId')
  const email = searchParams.get('email')

  try {
    let actualUserId = userId

    // Jika email diberikan, cari user berdasarkan email (untuk handle mock auth IDs)
    if (email && !userId) {
      const user = await prisma.user.findUnique({ where: { email } })
      if (user) {
        actualUserId = user.id
      }
    } else if (email && userId) {
      // Cek apakah userId valid, jika tidak coba cari berdasarkan email
      const userById = await prisma.user.findUnique({ where: { id: userId } })
      if (!userById) {
        const userByEmail = await prisma.user.findUnique({ where: { email } })
        if (userByEmail) {
          actualUserId = userByEmail.id
        }
      }
    }

    const where: any = {}
    if (actualUserId) where.userId = actualUserId
    if (courseId) where.courseId = courseId

    const enrollments = await prisma.enrollment.findMany({
      where,
      include: { 
        course: {
          include: {
            sections: {
              include: {
                lessons: {
                  orderBy: { order: 'asc' }
                }
              },
              orderBy: { order: 'asc' }
            },
            instructor: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    })

    // If both userId and courseId are provided, return single enrollment or null
    if (actualUserId && courseId) {
      return NextResponse.json(enrollments[0] || null)
    }

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}