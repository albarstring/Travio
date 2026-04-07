// Server-side authentication utilities
import { cookies } from "next/headers"
import type { AuthSession } from "./types"

export async function getSessionServer(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("auth-session")
    if (sessionCookie?.value) {
      return JSON.parse(sessionCookie.value)
    }
  } catch (error) {
    console.error("Error reading session cookie:", error)
  }
  return null
}

export async function setSessionServer(session: AuthSession | null): Promise<void> {
  try {
    const cookieStore = await cookies()
    if (session) {
      cookieStore.set("auth-session", JSON.stringify(session), {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })
    } else {
      cookieStore.delete("auth-session")
    }
  } catch (error) {
    console.error("Error setting session cookie:", error)
  }
}

export async function clearSessionServer(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("auth-session")
  } catch (error) {
    console.error("Error clearing session cookie:", error)
  }
}
