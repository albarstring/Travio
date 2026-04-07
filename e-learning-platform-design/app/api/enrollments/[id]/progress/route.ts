import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// PUT update enrollment progress
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: enrollmentId } = await params
    const body = await request.json()
    const { lessonId, completed } = body

    if (!lessonId) {
      return NextResponse.json({ error: "lessonId is required" }, { status: 400 })
    }

    // Get current enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            sections: {
              include: {
                lessons: true
              }
            }
          }
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    // Get all lessons from course
    const allLessons = enrollment.course.sections?.flatMap(s => s.lessons || []) || []
    const totalLessons = allLessons.length

    // Update completedLessons - Parse from JSON string stored in DB
    let completedLessons: string[] = []
    try {
      if (typeof enrollment.completedLessons === 'string') {
        const parsed = JSON.parse(enrollment.completedLessons)
        completedLessons = Array.isArray(parsed) ? parsed : []
      } else if (Array.isArray(enrollment.completedLessons)) {
        completedLessons = [...enrollment.completedLessons]
      }
    } catch (e) {
      console.error('Error parsing completedLessons:', e)
      completedLessons = []
    }

    if (completed) {
      // Add lesson if not already completed
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId)
      }
    } else {
      // Remove lesson from completed
      completedLessons = completedLessons.filter(id => id !== lessonId)
    }

    // Calculate progress
    const progress = totalLessons > 0 
      ? Math.round((completedLessons.length / totalLessons) * 100) 
      : 0

    // Check if course is completed
    const isCompleted = progress === 100 && totalLessons > 0

    // Update enrollment
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        completedLessons: JSON.stringify(completedLessons),
        progress,
        completedAt: isCompleted ? new Date() : null,
      },
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
            }
          }
        },
        user: true
      }
    })

    // If course is completed, generate certificate
    if (isCompleted) {
      console.log('[CERTIFICATE] Course completed! Generating certificate...')
      
      // Check if certificate already exists
      const existingCertificate = await prisma.certificate.findUnique({
        where: { userId_courseId: { userId: enrollment.userId, courseId: enrollment.courseId } }
      })

      if (!existingCertificate) {
        // Generate certificate URL (could be a template, PDF generation service, etc.)
        const certificateUrl = `/certificates/${enrollmentId}-${Date.now()}.pdf`
        
        try {
          const certificate = await prisma.certificate.create({
            data: {
              userId: enrollment.userId,
              courseId: enrollment.courseId,
              certificateUrl,
              issuedAt: new Date()
            }
          })
          console.log('[CERTIFICATE] Certificate created:', certificate.id)
        } catch (certError) {
          console.error('[CERTIFICATE] Error creating certificate:', certError)
          // Continue anyway, enrollment update is the priority
        }
      }
    }

    return NextResponse.json({
      ...updatedEnrollment,
      courseCompleted: isCompleted,
      certificateGenerated: isCompleted
    })
  } catch (error) {
    console.error('Error updating enrollment progress:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

