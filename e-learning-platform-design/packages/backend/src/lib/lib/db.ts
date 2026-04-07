// Database access layer using Prisma
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// User operations
export const db = {
  users: {
    findById: (id: string) => prisma.user.findUnique({ where: { id } }),
    findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
    getAll: () => prisma.user.findMany(),
  },

  courses: {
    findById: (id: string) => prisma.course.findUnique({
      where: { id },
      include: { instructor: true, lessons: { orderBy: { order: 'asc' } } }
    }),
    getAll: () => prisma.course.findMany({
      include: { instructor: true, lessons: { orderBy: { order: 'asc' } } }
    }),
    getByInstructor: (instructorId: string) => prisma.course.findMany({
      where: { instructorId },
      include: { instructor: true, lessons: { orderBy: { order: 'asc' } } }
    }),
    getByCategory: (category: string) => prisma.course.findMany({
      where: { category: { equals: category, mode: 'insensitive' } },
      include: { instructor: true, lessons: { orderBy: { order: 'asc' } } }
    }),
    search: (query: string) => prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { instructor: true, lessons: { orderBy: { order: 'asc' } } }
    }),
  },

  lessons: {
    findById: (id: string) => prisma.lesson.findUnique({ where: { id } }),
    getByCourse: (courseId: string) => prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' }
    }),
  },

  enrollments: {
    findById: (id: string) => prisma.enrollment.findUnique({
      where: { id },
      include: { user: true, course: true }
    }),
    getByUser: (userId: string) => prisma.enrollment.findMany({
      where: { userId },
      include: { course: true }
    }),
    getByUserAndCourse: (userId: string, courseId: string) => prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { user: true, course: true }
    }),
    getByCourse: (courseId: string) => prisma.enrollment.findMany({
      where: { courseId },
      include: { user: true }
    }),
    getAll: () => prisma.enrollment.findMany({
      include: { user: true, course: true }
    }),
  },

  reviews: {
    findById: (id: string) => prisma.review.findUnique({
      where: { id },
      include: { user: true }
    }),
    getByCourse: (courseId: string) => prisma.review.findMany({
      where: { courseId },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    }),
    getByUser: (userId: string) => prisma.review.findMany({
      where: { userId },
      include: { course: true }
    }),
  },

  payments: {
    findById: (id: string) => prisma.payment.findUnique({
      where: { id },
      include: { user: true, course: true }
    }),
    getByUser: (userId: string) => prisma.payment.findMany({
      where: { userId },
      include: { course: true }
    }),
    getByUserAndCourse: (userId: string, courseId: string) => prisma.payment.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      },
      include: { user: true, course: true }
    }),
  },
}
