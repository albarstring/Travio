import { sectionRepository } from "@/lib/repositories/SectionRepository"
import {
  NotFoundException,
  ValidationException,
  AuthorizationException
} from "@/lib/exceptions/AppException"

/**
 * Section Service
 * Template untuk service dengan relasi & authorization
 */
export class SectionService {
  private sectionRepo: typeof sectionRepository

  constructor() {
    this.sectionRepo = sectionRepository
  }

  /**
   * Get section detail
   */
  async getSection(id: string) {
    if (!id?.trim()) {
      throw new ValidationException("Section ID is required")
    }

    const section = await this.sectionRepo.findById(id)
    if (!section) {
      throw new NotFoundException("Section not found")
    }

    return section
  }

  /**
   * Get all sections untuk course
   */
  async getCourseSections(courseId: string) {
    if (!courseId?.trim()) {
      throw new ValidationException("Course ID is required")
    }

    return await this.sectionRepo.findByCourse(courseId)
  }

  /**
   * Create section baru
   */
  async createSection(
    courseId: string,
    title: string,
    userId: string,
    userRole: string
  ) {
    // Validasi input
    this.validateSectionInput(courseId, title)

    // TODO: Check if user is course instructor
    // const course = await courseRepository.findById(courseId)
    // if (course?.instructorId !== userId && userRole !== 'admin') {
    //   throw new AuthorizationException("You cannot add sections to this course")
    // }

    // Get next order
    const order = await this.sectionRepo.getNextOrder(courseId)

    return await this.sectionRepo.create({
      courseId,
      title,
      order
    })
  }

  /**
   * Update section
   */
  async updateSection(
    id: string,
    data: { title?: string; order?: number },
    userId: string,
    userRole: string
  ) {
    const section = await this.getSection(id)

    // TODO: Authorization check
    // const course = await courseRepository.findById(section.courseId)
    // if (course?.instructorId !== userId && userRole !== 'admin') {
    //   throw new AuthorizationException("You cannot update this section")
    // }

    return await this.sectionRepo.update(id, data)
  }

  /**
   * Delete section
   */
  async deleteSection(id: string, userId: string, userRole: string) {
    const section = await this.getSection(id)

    // TODO: Authorization check
    // const course = await courseRepository.findById(section.courseId)
    // if (course?.instructorId !== userId && userRole !== 'admin') {
    //   throw new AuthorizationException("You cannot delete this section")
    // }

    return await this.sectionRepo.delete(id)
  }

  /**
   * Private: Validasi input
   */
  private validateSectionInput(courseId: string, title: string): void {
    if (!courseId?.trim()) {
      throw new ValidationException("Course ID is required")
    }
    if (!title?.trim()) {
      throw new ValidationException("Section title is required")
    }
  }
}

export const sectionService = new SectionService()
