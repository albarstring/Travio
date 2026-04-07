import { NextRequest } from 'next/server'
import { successResponse, handleException } from '@/lib/api-response'
import { courseService } from '@/lib/services/CourseService'

/**
 * GET /api/courses/[id]
 * Fetch single course detail
 * 
 * Route handler yang mengikuti refactored architecture
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Extract parameters
    const { id: courseId } = await params

    // 2. Call service (business logic)
    const course = await courseService.getCourse(courseId)

    // 3. Return response
    return successResponse(course)
  } catch (error) {
    return handleException(error)
  }
}

/**
 * DELETE /api/courses/[id]
 * Delete course dengan authorization check
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Extract parameters
    const { id: courseId } = await params

    // 2. Get current user
    // TODO: Extract dari header/cookie - integrate dengan auth system Anda
    const currentUserId = "user123"
    const currentUserRole = "instructor"

    // 3. Call service untuk delete
    const course = await courseService.deleteCourse(
      courseId,
      currentUserId,
      currentUserRole
    )

    // 4. Return success response
    return successResponse({ 
      message: "Course deleted successfully", 
      id: course.id 
    })
  } catch (error) {
    return handleException(error)
  }
}