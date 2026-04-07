import { prisma } from "@/lib/db"
import type { User } from "@prisma/client"

/**
 * User Repository
 * Menangani semua akses database untuk User
 * Mengikuti Repository Pattern
 */
export class UserRepository {
  /**
   * Mencari user berdasarkan email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email }
    })
  }

  /**
   * Mencari user berdasarkan ID
   */
  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id }
    })
  }

  /**
   * Membuat user baru
   */
  async create(data: {
    email: string
    password: string
    name: string
    role: string
  }): Promise<User> {
    return await prisma.user.create({
      data
    })
  }

  /**
   * Update user
   */
  async update(
    id: string,
    data: Partial<User>
  ): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data
    })
  }

  /**
   * Cek apakah email sudah terdaftar
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email)
    return user !== null
  }
}

// Singleton instance
export const userRepository = new UserRepository()
