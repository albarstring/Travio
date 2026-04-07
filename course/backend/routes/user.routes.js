import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middlewares/auth.middleware.js';
import { hashPassword } from '../utils/bcrypt.util.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticate);

// Get user profile
router.get('/profile', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        phone: true,
        bio: true,
        createdAt: true
      }
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Update profile
router.put('/profile', async (req, res, next) => {
  try {
    const { name, phone, bio, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(bio !== undefined && { bio }),
        ...(avatar && { avatar })
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        phone: true,
        bio: true
      }
    });

    res.json({
      message: 'Profile updated',
      user
    });
  } catch (error) {
    next(error);
  }
});

// Change password
router.put('/password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const { comparePassword } = await import('../utils/bcrypt.util.js');
    const isPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Get learning activity
router.get('/activity', async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;

    const activities = await prisma.activity.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json({ activities });
  } catch (error) {
    next(error);
  }
});

// Get dashboard stats
router.get('/dashboard', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [
      totalCourses,
      activeCourses,
      completedCourses,
      enrollments,
      totalStudyHours,
      recentActivities
    ] = await Promise.all([
      prisma.enrollment.count({
        where: { userId }
      }),
      prisma.enrollment.count({
        where: {
          userId,
          status: 'IN_PROGRESS'
        }
      }),
      prisma.enrollment.count({
        where: {
          userId,
          status: 'COMPLETED'
        }
      }),
      prisma.enrollment.findMany({
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
        orderBy: { enrolledAt: 'desc' },
        take: 5
      }),
      prisma.progress.aggregate({
        where: { userId },
        _sum: {
          watchedDuration: true
        }
      }),
      prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    // Calculate overall progress
    const overallProgress = enrollments.length > 0
      ? enrollments.reduce((sum, e) => sum + Number(e.progress), 0) / enrollments.length
      : 0;

    const totalHours = Math.round((totalStudyHours._sum.watchedDuration || 0) / 3600);

    res.json({
      stats: {
        totalCourses,
        activeCourses,
        completedCourses,
        overallProgress: Math.round(overallProgress),
        totalStudyHours: totalHours
      },
      recentEnrollments: enrollments,
      recentActivities
    });
  } catch (error) {
    next(error);
  }
});

export default router;

