import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSessionServer } from "@/lib/auth-server"

// GET /api/profile/[userId] - Get public profile by user ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const session = await getSessionServer()

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        taughtCourses: {
          where: {
            isPublished: true
          },
          include: {
            enrollments: true,
            reviews: {
              take: 5,
              orderBy: {
                createdAt: "desc"
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        },
        reviews: {
          include: {
            course: true
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 10
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Only show public information
    const publicProfile = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      skills: user.skills ? JSON.parse(user.skills) : [],
      website: user.website,
      socialLinks: user.socialLinks ? JSON.parse(user.socialLinks as any) : {},
      taughtCourses: user.taughtCourses,
      reviews: user.reviews,
      createdAt: user.createdAt
    }

    return NextResponse.json(publicProfile)
  } catch (error) {
    console.error("Error fetching public profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

