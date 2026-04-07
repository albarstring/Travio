import { prisma } from "@/lib/db"
import type { Course } from "@prisma/client"

/**
 * Course Repository
 * Template untuk repository layer lainnya
 */
export class CourseRepository {
  /**
   * Mencari course berdasarkan ID
   */
  async findById(id: string): Promise<Course | null> {
    return await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        sections: {
          select: {
            id: true,
            title: true,
            order: true
          }
        }
      }
    })
  }

  /**
   * Mencari semua course dengan pagination
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      category?: string
      instructorId?: string
      isPublished?: boolean
    }
  ) {
    const skip = (page - 1) * limit

    const where: any = {}
    if (filters?.category) where.category = filters.category
    if (filters?.instructorId) where.instructorId = filters.instructorId
    if (filters?.isPublished !== undefined) where.isPublished = filters.isPublished

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      }),
      prisma.course.count({ where })
    ])

    return {
      data: courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * Membuat course baru
   */
  async create(data: {
    title: string
    description: string
    instructorId: string
    category: string
    price: number
  }): Promise<Course> {
    return await prisma.course.create({
      data,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })
  }

  /**
   * Update course
   */
  async update(id: string, data: Partial<Course>): Promise<Course> {
    return await prisma.course.update({
      where: { id },
      data,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })
  }

  /**
   * Delete course
   */
  async delete(id: string): Promise<Course> {
    return await prisma.course.delete({
      where: { id }
    })
  }

  /**
   * Publish/unpublish course
   */
  async publish(id: string, isPublished: boolean): Promise<Course> {
    return await this.update(id, { isPublished })
  }

  /**
   * Get course oleh instructor
   */
  async findByInstructor(instructorId: string) {
    return await prisma.course.findMany({
      where: { instructorId },
      include: {
        sections: {
          include: {
            lessons: true
          }
        }
      }
    })
  }
}

export const courseRepository = new CourseRepository()
