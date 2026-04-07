import { NextResponse } from "next/server"
import type { AppException } from "@/lib/exceptions/AppException"

/**
 * API Response Helper
 * Untuk membuat response yang konsisten
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

/**
 * Success response
 */
export function successResponse<T>(data: T, statusCode: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data
    } as ApiResponse<T>,
    { status: statusCode }
  )
}

/**
 * Error response
 */
export function errorResponse(
  error: AppException | string,
  statusCode?: number
) {
  if (typeof error === "string") {
    return NextResponse.json(
      {
        success: false,
        error
      } as ApiResponse,
      { status: statusCode || 500 }
    )
  }

  return NextResponse.json(
    {
      success: false,
      error: error.message,
      code: error.code
    } as ApiResponse,
    { status: error.statusCode }
  )
}

/**
 * Exception handler untuk route handler
 */
export function handleException(error: any) {
  console.error("Error:", error)

  // AppException
  if (error.statusCode) {
    return errorResponse(error)
  }

  // Generic error
  return errorResponse("Internal server error", 500)
}
