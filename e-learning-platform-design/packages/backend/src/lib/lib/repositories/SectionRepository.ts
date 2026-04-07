import { prisma } from "@/lib/db"
import type { Section, Lesson } from "@prisma/client"

/**
 * Section Repository
 * Template untuk repository dengan relasi ke course
 */
export class SectionRepository {
  /**
   * Mencari section berdasarkan ID
   */
  async findById(id: string) {
    return await prisma.section.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { order: "asc" }
        }
      }
    })
  }

  /**
   * Mencari sections berdasarkan courseId
   */
  async findByCourse(courseId: string) {
    return await prisma.section.findMany({
      where: { courseId },
      include: {
        lessons: {
          orderBy: { order: "asc" }
        }
      },
      orderBy: { order: "asc" }
    })
  }

  /**
   * Membuat section baru
   */
  async create(data: {
    courseId: string
    title: string
    order: number
  }) {
    return await prisma.section.create({
      data,
      include: {
        lessons: true
      }
    })
  }

  /**
   * Update section
   */
  async update(
    id: string,
    data: Partial<{
      title: string
      order: number
    }>
  ) {
    return await prisma.section.update({
      where: { id },
      data,
      include: {
        lessons: true
      }
    })
  }

  /**
   * Delete section
   */
  async delete(id: string) {
    return await prisma.section.delete({
      where: { id }
    })
  }

  /**
   * Get next order number untuk section baru
   */
  async getNextOrder(courseId: string): Promise<number> {
    const lastSection = await prisma.section.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
      select: { order: true }
    })

    return (lastSection?.order || 0) + 1
  }
}

export const sectionRepository = new SectionRepository()
