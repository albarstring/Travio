import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middlewares/auth.middleware.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticate);

// Get user certificates
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const certificates = await prisma.certificate.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            slug: true
          }
        }
      },
      orderBy: { issuedAt: 'desc' }
    });

    res.json({ certificates });
  } catch (error) {
    next(error);
  }
});

// Get certificate for a course
router.get('/course/:courseId', async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if course is completed
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (!enrollment || enrollment.status !== 'COMPLETED') {
      return res.status(403).json({
        message: 'Course must be completed to get certificate'
      });
    }

    // Check if certificate exists
    let certificate = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      include: {
        course: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Generate certificate if doesn't exist
    if (!certificate) {
      // TODO: Generate PDF certificate
      // For now, create a placeholder
      const certificateUrl = `/certificates/${userId}-${courseId}.pdf`;

      certificate = await prisma.certificate.create({
        data: {
          userId,
          courseId,
          certificateUrl
        },
        include: {
          course: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    }

    res.json({ certificate });
  } catch (error) {
    next(error);
  }
});

export default router;

