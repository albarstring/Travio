import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

export const getCourses = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      level,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {
      isPublished: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(category && { categoryId: category }),
      ...(level && { level }),
      ...(minPrice || maxPrice ? {
        price: {
          ...(minPrice && { gte: parseFloat(minPrice) }),
          ...(maxPrice && { lte: parseFloat(maxPrice) })
        }
      } : {})
    };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          },
          instructor: {
            select: { id: true, name: true, avatar: true }
          },
          _count: {
            select: { enrollments: true }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: parseInt(limit)
      }),
      prisma.course.count({ where })
    ]);

    res.json({
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        category: true,
        instructor: {
          select: { id: true, name: true, avatar: true, bio: true }
        },
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            order: true,
            isPreview: true
          }
        },
        quizzes: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            order: true
          }
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true
          }
        }
      }
    });

    if (!course || (!course.isPublished && course.instructorId !== userId && req.user?.role !== 'ADMIN')) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check enrollment if user is logged in
    let enrollment = null;
    if (userId) {
      enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id
          }
        }
      });
    }

    res.json({
      course: {
        ...course,
        isEnrolled: !!enrollment,
        enrollment
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedCourses = async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        instructor: {
          select: { id: true, name: true, avatar: true }
        },
        _count: {
          select: { enrollments: true }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { totalStudents: 'desc' }
      ],
      take: 6
    });

    res.json({ courses });
  } catch (error) {
    next(error);
  }
};

