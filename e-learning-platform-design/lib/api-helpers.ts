import { getSession } from "./auth"

/**
 * Get headers with session information for API requests
 */
export function getAuthHeaders(): HeadersInit {
  const session = getSession()
  const headers: HeadersInit = {
    "Content-Type": "application/json"
  }
  
  if (session) {
    if (session.userId) {
      headers["x-user-id"] = session.userId
    }
    if (session.email) {
      headers["x-user-email"] = session.email
    }
    if (session.role) {
      headers["x-user-role"] = session.role
    }
  }
  
  return headers
}

