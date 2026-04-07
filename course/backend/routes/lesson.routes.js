import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middlewares/auth.middleware.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticate);

router.get('/:lessonId', async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          include: {
            enrollments: {
              where: { userId }
            }
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user is enrolled (unless preview)
    if (!lesson.isPreview) {
      const enrollment = lesson.course.enrollments[0];
      if (!enrollment) {
        return res.status(403).json({ message: 'Not enrolled in this course' });
      }
    }

    // Get progress
    const progress = await prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      }
    });

    // Get notes
    const notes = await prisma.note.findMany({
      where: {
        userId,
        lessonId
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      lesson: {
        ...lesson,
        progress,
        notes
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;

