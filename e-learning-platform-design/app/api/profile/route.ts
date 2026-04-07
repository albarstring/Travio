import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/profile - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    // Get session from request headers (sent from client)
    const userId = request.headers.get("x-user-id")
    const userEmail = request.headers.get("x-user-email")
    
    if (!userId && !userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find user by ID or email
    let user = null
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } })
    }
    if (!user && userEmail) {
      user = await prisma.user.findUnique({ where: { email: userEmail } })
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userWithData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        enrollments: {
          include: {
            course: true
          }
        },
        reviews: {
          include: {
            course: true
          }
        },
        certificates: {
          include: {
            course: true
          }
        }
      }
    })

    if (!userWithData) {
      return NextResponse.json({ error: "User data not found" }, { status: 404 })
    }

    // Calculate statistics for instructor
    let instructorStats = null
    if (userWithData.role === "instructor") {
      try {
        // Get instructor's courses
        const instructorCourses = await prisma.course.findMany({
          where: { instructorId: userWithData.id },
          include: { enrollments: true }
        })
        
        // Fetch payments for this instructor's courses
        const instructorCourseIds = instructorCourses.map((c: any) => c.id)
        const instructorPayments = await prisma.payment.findMany({
          where: {
            courseId: { in: instructorCourseIds },
            status: "completed"
          }
        })
        
        const totalEarnings = instructorPayments.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0)
        const totalStudents = new Set(
          instructorCourses.flatMap((course: any) => (course.enrollments || []).map((e: any) => e.userId))
        ).size
        const totalCourses = instructorCourses.length
        const avgRating = instructorCourses.length > 0
          ? instructorCourses.reduce((sum: number, course: any) => sum + (course.rating || 0), 0) / instructorCourses.length
          : 0

        instructorStats = {
          totalEarnings,
          totalStudents,
          totalCourses,
          avgRating
        }
      } catch (error) {
        console.error("Error calculating instructor stats:", error)
        instructorStats = {
          totalEarnings: 0,
          totalStudents: 0,
          totalCourses: 0,
          avgRating: 0
        }
      }
    }

    // Parse JSON fields safely
    let skills: string[] = []
    let socialLinks: any = {}
    let notificationSettings: any = {}
    let privacySettings: any = {}

    try {
      if (userWithData.skills) {
        if (Array.isArray(userWithData.skills)) {
          skills = userWithData.skills
        } else if (typeof userWithData.skills === 'string') {
          skills = JSON.parse(userWithData.skills)
        }
      }
    } catch (e) {
      console.error("Error parsing skills:", e)
    }

    try {
      if (userWithData.socialLinks) {
        if (typeof userWithData.socialLinks === 'object' && userWithData.socialLinks !== null) {
          socialLinks = userWithData.socialLinks
        } else if (typeof userWithData.socialLinks === 'string') {
          socialLinks = JSON.parse(userWithData.socialLinks)
        }
      }
    } catch (e) {
      console.error("Error parsing socialLinks:", e)
    }

    try {
      if (userWithData.notificationSettings) {
        if (typeof userWithData.notificationSettings === 'object' && userWithData.notificationSettings !== null) {
          notificationSettings = userWithData.notificationSettings
        } else if (typeof userWithData.notificationSettings === 'string') {
          notificationSettings = JSON.parse(userWithData.notificationSettings)
        }
      }
    } catch (e) {
      console.error("Error parsing notificationSettings:", e)
    }

    try {
      if (userWithData.privacySettings) {
        if (typeof userWithData.privacySettings === 'object' && userWithData.privacySettings !== null) {
          privacySettings = userWithData.privacySettings
        } else if (typeof userWithData.privacySettings === 'string') {
          privacySettings = JSON.parse(userWithData.privacySettings)
        }
      }
    } catch (e) {
      console.error("Error parsing privacySettings:", e)
    }

    return NextResponse.json({
      ...userWithData,
      skills,
      socialLinks,
      notificationSettings,
      privacySettings,
      instructorStats
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("Error details:", errorMessage)
    return NextResponse.json({ 
      error: "Internal server error",
      details: errorMessage 
    }, { status: 500 })
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    // Get session from request headers
    const userId = request.headers.get("x-user-id")
    const userEmail = request.headers.get("x-user-email")
    
    if (!userId && !userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find user by ID or email
    let user = null
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } })
    }
    if (!user && userEmail) {
      user = await prisma.user.findUnique({ where: { email: userEmail } })
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const {
      name,
      bio,
      avatar,
      skills,
      phone,
      location,
      website,
      socialLinks,
      notificationSettings,
      privacySettings
    } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (avatar !== undefined) updateData.avatar = avatar
    if (phone !== undefined) updateData.phone = phone
    if (location !== undefined) updateData.location = location
    if (website !== undefined) updateData.website = website
    if (skills !== undefined) {
      updateData.skills = Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : [])
    }
    if (socialLinks !== undefined) {
      updateData.socialLinks = typeof socialLinks === 'object' && socialLinks !== null 
        ? socialLinks 
        : {}
    }
    if (notificationSettings !== undefined) {
      updateData.notificationSettings = typeof notificationSettings === 'object' && notificationSettings !== null 
        ? notificationSettings 
        : {}
    }
    if (privacySettings !== undefined) {
      updateData.privacySettings = typeof privacySettings === 'object' && privacySettings !== null 
        ? privacySettings 
        : {}
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    })

    // Parse JSON fields for response safely
    let skillsParsed: string[] = []
    let socialLinksParsed: any = {}
    let notificationSettingsParsed: any = {}
    let privacySettingsParsed: any = {}

    try {
      if (updatedUser.skills) {
        if (Array.isArray(updatedUser.skills)) {
          skillsParsed = updatedUser.skills
        } else if (typeof updatedUser.skills === 'string') {
          skillsParsed = JSON.parse(updatedUser.skills)
        }
      }
    } catch (e) {
      console.error("Error parsing skills:", e)
    }

    try {
      if (updatedUser.socialLinks) {
        if (typeof updatedUser.socialLinks === 'object' && updatedUser.socialLinks !== null) {
          socialLinksParsed = updatedUser.socialLinks
        } else if (typeof updatedUser.socialLinks === 'string') {
          socialLinksParsed = JSON.parse(updatedUser.socialLinks)
        }
      }
    } catch (e) {
      console.error("Error parsing socialLinks:", e)
    }

    try {
      if (updatedUser.notificationSettings) {
        if (typeof updatedUser.notificationSettings === 'object' && updatedUser.notificationSettings !== null) {
          notificationSettingsParsed = updatedUser.notificationSettings
        } else if (typeof updatedUser.notificationSettings === 'string') {
          notificationSettingsParsed = JSON.parse(updatedUser.notificationSettings)
        }
      }
    } catch (e) {
      console.error("Error parsing notificationSettings:", e)
    }

    try {
      if (updatedUser.privacySettings) {
        if (typeof updatedUser.privacySettings === 'object' && updatedUser.privacySettings !== null) {
          privacySettingsParsed = updatedUser.privacySettings
        } else if (typeof updatedUser.privacySettings === 'string') {
          privacySettingsParsed = JSON.parse(updatedUser.privacySettings)
        }
      }
    } catch (e) {
      console.error("Error parsing privacySettings:", e)
    }

    return NextResponse.json({
      ...updatedUser,
      skills: skillsParsed,
      socialLinks: socialLinksParsed,
      notificationSettings: notificationSettingsParsed,
      privacySettings: privacySettingsParsed
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("Error details:", errorMessage)
    return NextResponse.json({ 
      error: "Internal server error",
      details: errorMessage 
    }, { status: 500 })
  }
}

