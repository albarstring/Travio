import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateProgress = async (req, res, next) => {
  try {
    const { lessonId, courseId, watchedDuration, status } = req.body;
    const userId = req.user.id;

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    // Update or create progress
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      },
      update: {
        watchedDuration: parseInt(watchedDuration) || 0,
        status: status || 'IN_PROGRESS',
        ...(status === 'COMPLETED' && { completedAt: new Date() })
      },
      create: {
        userId,
        lessonId,
        courseId,
        watchedDuration: parseInt(watchedDuration) || 0,
        status: status || 'IN_PROGRESS',
        ...(status === 'COMPLETED' && { completedAt: new Date() })
      }
    });

    // Calculate overall course progress
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          select: { id: true }
        }
      }
    });

    const totalLessons = course.lessons.length;
    const completedLessons = await prisma.progress.count({
      where: {
        userId,
        courseId,
        status: 'COMPLETED'
      }
    });

    const overallProgress = totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

    // Update enrollment progress
    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      data: {
        progress: overallProgress,
        status: overallProgress === 100 ? 'COMPLETED' : 'IN_PROGRESS',
        ...(overallProgress === 100 && { completedAt: new Date() })
      }
    });

    // Create activity if completed
    if (status === 'COMPLETED') {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId }
      });

      await prisma.activity.create({
        data: {
          userId,
          type: 'lesson_completed',
          description: `Completed lesson: ${lesson.title}`
        }
      });
    }

    res.json({
      message: 'Progress updated',
      progress,
      overallProgress
    });
  } catch (error) {
    next(error);
  }
};

export const getProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const progressList = await prisma.progress.findMany({
      where: {
        userId,
        courseId
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            duration: true,
            order: true
          }
        }
      },
      orderBy: {
        lesson: {
          order: 'asc'
        }
      }
    });

    res.json({ progress: progressList });
  } catch (error) {
    next(error);
  }
};

