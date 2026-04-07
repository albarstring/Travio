import { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { authService, type SessionData } from "@/lib/services/AuthService"
import { successResponse, handleException } from "@/lib/api-response"

/**
 * POST /api/auth/login
 * Handle user login
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Extract & parse request body
    const body = await request.json()
    const { email, password } = body

    // 2. Call auth service (business logic)
    const loginResponse = await authService.login(email, password)

    // 3. Get user data for session
    const sessionData: SessionData = {
      userId: loginResponse.id,
      email: loginResponse.email,
      role: loginResponse.role,
      name: loginResponse.name,
      avatar: loginResponse.avatar
    }

    // 4. Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-session", JSON.stringify(sessionData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/"
    })

    // 5. Return success response
    return successResponse(loginResponse)
  } catch (error: any) {
    return handleException(error)
  }
}


