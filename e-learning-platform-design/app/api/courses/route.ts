import { type NextRequest } from "next/server"
import { successResponse, handleException } from "@/lib/api-response"
import { courseService } from "@/lib/services/CourseService"

/**
 * GET /api/courses
 * Fetch all courses dengan pagination dan filter
 * 
 * Query params:
 *   - page: number (default: 1)
 *   - limit: number (default: 10, max: 100)
 *   - category: string (optional)
 *   - instructorId: string (optional)
 *   - published: boolean (optional)
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Extract query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "10", 10)
    const category = searchParams.get("category") || undefined
    const instructorId = searchParams.get("instructorId") || undefined
    const isPublished =
      searchParams.get("published") === "true"
        ? true
        : searchParams.get("published") === "false"
          ? false
          : undefined

    // 2. Call service dengan filter
    const result = await courseService.listCourses(page, limit, {
      category,
      instructorId,
      isPublished
    })

    // 3. Return response
    return successResponse(result)
  } catch (error) {
    return handleException(error)
  }
}

/**
 * POST /api/courses
 * Create new course
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body = await request.json()

    // 2. Get current user dari session/auth
    // TODO: Extract dari header/cookie - integrate dengan auth system Anda
    const currentUserId = body.instructorId
    const currentUserRole = "instructor"

    // 3. Call service untuk create
    const course = await courseService.createCourse(
      {
        title: body.title,
        description: body.description,
        instructorId: body.instructorId,
        category: body.category,
        price: parseFloat(body.price)
      },
      currentUserId,
      currentUserRole
    )

    // 4. Return response with 201 Created
    return successResponse(course, 201)
  } catch (error) {
    return handleException(error)
  }
}