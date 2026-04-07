import bcrypt from "bcryptjs"
import type { User } from "@prisma/client"
import { userRepository } from "@/lib/repositories/UserRepository"
import {
  AuthenticationException,
  ValidationException,
  ConflictException
} from "@/lib/exceptions/AppException"

/**
 * Session Object Type
 */
export interface SessionData {
  userId: string
  email: string
  role: string
  name: string
  avatar: string | null
}

/**
 * Login Response Type
 */
export interface LoginResponse {
  id: string
  name: string
  email: string
  role: string
  avatar: string | null
  needsProfileCompletion: boolean
}

/**
 * Auth Service
 * Menangani business logic untuk authentication
 * Mengikuti OOP principles
 */
export class AuthService {
  private userRepo: typeof userRepository

  constructor() {
    this.userRepo = userRepository
  }

  /**
   * Validate login credentials
   * @throws ValidationException jika email atau password kosong
   * @throws AuthenticationException jika email/password invalid
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // Validation
    this.validateLoginInput(email, password)

    // Find user
    const user = await this.userRepo.findByEmail(email)
    if (!user) {
      throw new AuthenticationException("Invalid email or password")
    }

    // Verify password
    await this.verifyPassword(password, user.password)

    // Check profile completion
    const needsProfileCompletion = this.checkNeedsProfileCompletion(user)

    // Return login response
    return this.buildLoginResponse(user, needsProfileCompletion)
  }

  /**
   * Validate login input
   */
  private validateLoginInput(email: string, password: string): void {
    if (!email?.trim()) {
      throw new ValidationException("Email is required")
    }
    if (!password) {
      throw new ValidationException("Password is required")
    }
  }

  /**
   * Verify password dengan bcrypt
   */
  private async verifyPassword(plainPassword: string, hashedPassword: string): Promise<void> {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword)
    if (!isValid) {
      throw new AuthenticationException("Invalid email or password")
    }
  }

  /**
   * Check apakah user perlu melengkapi profile
   */
  private checkNeedsProfileCompletion(user: User): boolean {
    // Admin tidak perlu melengkapi profile
    if (user.role === "admin") {
      return false
    }
    // Check jika bio atau avatar belum ada
    return !user.bio || !user.avatar
  }

  /**
   * Build login response
   */
  private buildLoginResponse(user: User, needsProfileCompletion: boolean): LoginResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || null,
      needsProfileCompletion
    }
  }

  /**
   * Build session data untuk cookie
   */
  buildSessionData(user: User): SessionData {
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avatar: user.avatar || null
    }
  }
}

// Singleton instance
export const authService = new AuthService()
