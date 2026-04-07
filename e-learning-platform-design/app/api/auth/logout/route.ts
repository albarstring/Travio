import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // Clear auth-session cookie
  const cookieStore = await cookies()
  cookieStore.delete("auth-session")
  
  return response
}
