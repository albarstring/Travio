// Authentication utilities (Client-side)
import type { AuthSession } from "./types"
import { mockUsers } from "./mock-data"

// Simulate session storage
let currentSession: AuthSession | null = null

export function setSession(session: AuthSession | null) {
  currentSession = session
  if (session) {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth-session", JSON.stringify(session))
    }
  } else {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-session")
    }
  }
}

export function getSession(): AuthSession | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("auth-session")
    if (stored) {
      return JSON.parse(stored)
    }
  }
  return currentSession
}

export function login(email: string, password: string): AuthSession | null {
  const user = mockUsers.find((u) => u.email === email)
  if (user && user.password === password) {
    const session: AuthSession = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    }
    setSession(session)
    return session
  }
  return null
}

export function logout() {
  setSession(null)
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}

export function getUserRole(): string | null {
  return getSession()?.role || null
}

export function getCurrentUserId(): string | null {
  return getSession()?.userId || null
}

export function requireRole(...roles: string[]): boolean {
  const session = getSession()
  return session ? roles.includes(session.role) : false
}
