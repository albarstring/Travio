import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const enrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (existingEnrollment) {
      return res.status(409).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: 'NOT_STARTED',
        progress: 0
      },
      include: {
        course: {
          include: {
            category: true,
            instructor: {
              select: { id: true, name: true, avatar: true }
            }
          }
        }
      }
    });

    // Update course total students
    await prisma.course.update({
      where: { id: courseId },
      data: {
        totalStudents: {
          increment: 1
        }
      }
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId,
        type: 'course_enrolled',
        description: `Enrolled in ${course.title}`
      }
    });

    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment
    });
  } catch (error) {
    next(error);
  }
};

export const getMyEnrollments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const where = {
      userId,
      ...(status && { status })
    };

    const enrollments = await prisma.enrollment.findMany({
      where,
      include: {
        course: {
          include: {
            category: {
              select: { id: true, name: true, slug: true }
            },
            instructor: {
              select: { id: true, name: true, avatar: true }
            },
            _count: {
              select: { lessons: true }
            }
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    res.json({ enrollments });
  } catch (error) {
    next(error);
  }
};

export const getEnrollment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      include: {
        course: {
          include: {
            category: true,
            instructor: {
              select: { id: true, name: true, avatar: true }
            },
            lessons: {
              orderBy: { order: 'asc' }
            },
            quizzes: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Get progress for each lesson
    const progressList = await prisma.progress.findMany({
      where: {
        userId,
        courseId
      }
    });

    res.json({
      enrollment: {
        ...enrollment,
        lessonProgress: progressList
      }
    });
  } catch (error) {
    next(error);
  }
};

