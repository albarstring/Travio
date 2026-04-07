import type { Course } from "@prisma/client"
import { courseRepository } from "@/lib/repositories/CourseRepository"
import {
  NotFoundException,
  ValidationException,
  AuthorizationException
} from "@/lib/exceptions/AppException"

/**
 * Course Service
 * Template untuk service layer lainnya
 * Menghandel business logic untuk course
 */
export class CourseService {
  private courseRepo: typeof courseRepository

  constructor() {
    this.courseRepo = courseRepository
  }

  /**
   * Get course detail dengan validasi
   */
  async getCourse(id: string) {
    if (!id?.trim()) {
      throw new ValidationException("Course ID is required")
    }

    const course = await this.courseRepo.findById(id)
    if (!course) {
      throw new NotFoundException("Course not found")
    }

    return course
  }

  /**
   * Get semua course dengan pagination dan filter
   */
  async listCourses(
    page: number = 1,
    limit: number = 10,
    filters?: {
      category?: string
      instructorId?: string
      isPublished?: boolean
    }
  ) {
    // Validasi pagination
    if (page < 1) throw new ValidationException("Page must be at least 1")
    if (limit < 1 || limit > 100) {
      throw new ValidationException("Limit must be between 1 and 100")
    }

    return await this.courseRepo.findAll(page, limit, filters)
  }

  /**
   * Buat course baru
   */
  async createCourse(
    data: {
      title: string
      description: string
      instructorId: string
      category: string
      price: number
    },
    currentUserId: string,
    currentUserRole: string
  ) {
    // Validasi input
    this.validateCourseInput(data)

    // Validasi authorization - hanya instructor atau admin yang bisa membuat course
    if (currentUserRole !== "admin" && currentUserRole !== "instructor") {
      throw new AuthorizationException("Only instructors can create courses")
    }

    // Instructor hanya bisa membuat course untuk diri sendiri
    if (
      currentUserRole === "instructor" &&
      data.instructorId !== currentUserId
    ) {
      throw new AuthorizationException(
        "You can only create courses for yourself"
      )
    }

    return await this.courseRepo.create(data)
  }

  /**
   * Update course
   */
  async updateCourse(
    id: string,
    data: Partial<Course>,
    currentUserId: string,
    currentUserRole: string
  ) {
    // Validasi course exists
    const course = await this.getCourse(id)

    // Validasi authorization
    if (
      currentUserRole !== "admin" &&
      course.instructorId !== currentUserId
    ) {
      throw new AuthorizationException("You cannot update this course")
    }

    return await this.courseRepo.update(id, data)
  }

  /**
   * Delete course
   */
  async deleteCourse(
    id: string,
    currentUserId: string,
    currentUserRole: string
  ) {
    const course = await this.getCourse(id)

    // Validasi authorization
    if (
      currentUserRole !== "admin" &&
      course.instructorId !== currentUserId
    ) {
      throw new AuthorizationException("You cannot delete this course")
    }

    return await this.courseRepo.delete(id)
  }

  /**
   * Publish/unpublish course
   */
  async publishCourse(
    id: string,
    isPublished: boolean,
    currentUserId: string,
    currentUserRole: string
  ) {
    const course = await this.getCourse(id)

    if (
      currentUserRole !== "admin" &&
      course.instructorId !== currentUserId
    ) {
      throw new AuthorizationException("You cannot publish this course")
    }

    return await this.courseRepo.publish(id, isPublished)
  }

  /**
   * Get instructor courses
   */
  async getInstructorCourses(instructorId: string) {
    if (!instructorId?.trim()) {
      throw new ValidationException("Instructor ID is required")
    }

    return await this.courseRepo.findByInstructor(instructorId)
  }

  /**
   * Private: Validasi course input
   */
  private validateCourseInput(data: {
    title: string
    description: string
    instructorId: string
    category: string
    price: number
  }): void {
    if (!data.title?.trim()) {
      throw new ValidationException("Course title is required")
    }
    if (!data.description?.trim()) {
      throw new ValidationException("Course description is required")
    }
    if (!data.instructorId?.trim()) {
      throw new ValidationException("Instructor ID is required")
    }
    if (!data.category?.trim()) {
      throw new ValidationException("Course category is required")
    }
    if (typeof data.price !== "number" || data.price < 0) {
      throw new ValidationException("Course price must be a positive number")
    }
  }
}

export const courseService = new CourseService()
