import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

// Dashboard stats
router.get('/dashboard', async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalTransactions,
      totalRevenue,
      recentCourses,
      recentTransactions
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.course.count(),
      prisma.transaction.count({ where: { status: 'PAID' } }),
      prisma.transaction.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true }
      }),
      prisma.course.findMany({
        include: {
          category: true,
          _count: {
            select: { enrollments: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.transaction.findMany({
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          course: {
            select: { id: true, title: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    res.json({
      stats: {
        totalUsers,
        totalCourses,
        totalTransactions,
        totalRevenue: totalRevenue._sum.amount || 0
      },
      recentCourses,
      recentTransactions
    });
  } catch (error) {
    next(error);
  }
});

// Course Management
router.get('/courses', async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        category: true,
        instructor: {
          select: { id: true, name: true }
        },
        _count: {
          select: { enrollments: true, lessons: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ courses });
  } catch (error) {
    next(error);
  }
});

router.post('/courses', upload.fields([
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res, next) => {
  try {
    const {
      title,
      slug,
      description,
      shortDescription,
      price,
      level,
      categoryId,
      isPublished
    } = req.body;

    const thumbnail = req.files?.thumbnail?.[0]?.filename
      ? `/uploads/thumbnails/${req.files.thumbnail[0].filename}`
      : null;

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        shortDescription,
        price: parseFloat(price) || 0,
        level,
        categoryId,
        instructorId: req.user.id,
        isPublished: isPublished === 'true',
        thumbnail
      }
    });

    res.status(201).json({
      message: 'Course created',
      course
    });
  } catch (error) {
    next(error);
  }
});

router.put('/courses/:id', upload.fields([
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.files?.thumbnail?.[0]?.filename) {
      updateData.thumbnail = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
    }

    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }

    if (updateData.isPublished !== undefined) {
      updateData.isPublished = updateData.isPublished === 'true';
    }

    const course = await prisma.course.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Course updated',
      course
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/courses/:id', async (req, res, next) => {
  try {
    await prisma.course.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Course deleted' });
  } catch (error) {
    next(error);
  }
});

// Lesson Management
router.post('/courses/:courseId/lessons', upload.fields([
  { name: 'video', maxCount: 1 }
]), async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const {
      title,
      description,
      duration,
      order,
      isPreview
    } = req.body;

    const videoUrl = req.files?.video?.[0]?.filename
      ? `/uploads/videos/${req.files.video[0].filename}`
      : null;

    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        title,
        description,
        videoUrl,
        duration: parseInt(duration) || 0,
        order: parseInt(order) || 0,
        isPreview: isPreview === 'true'
      }
    });

    // Update course total lessons and duration
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { lessons: true }
    });

    await prisma.course.update({
      where: { id: courseId },
      data: {
        totalLessons: course.lessons.length + 1,
        duration: course.lessons.reduce((sum, l) => sum + l.duration, 0) + (parseInt(duration) || 0)
      }
    });

    res.status(201).json({
      message: 'Lesson created',
      lesson
    });
  } catch (error) {
    next(error);
  }
});

router.put('/lessons/:id', upload.fields([
  { name: 'video', maxCount: 1 }
]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.files?.video?.[0]?.filename) {
      updateData.videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
    }

    if (updateData.duration) {
      updateData.duration = parseInt(updateData.duration);
    }

    if (updateData.order) {
      updateData.order = parseInt(updateData.order);
    }

    if (updateData.isPreview !== undefined) {
      updateData.isPreview = updateData.isPreview === 'true';
    }

    const lesson = await prisma.lesson.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Lesson updated',
      lesson
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/lessons/:id', async (req, res, next) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id }
    });

    await prisma.lesson.delete({
      where: { id: req.params.id }
    });

    // Update course
    const course = await prisma.course.findUnique({
      where: { id: lesson.courseId },
      include: { lessons: true }
    });

    await prisma.course.update({
      where: { id: lesson.courseId },
      data: {
        totalLessons: course.lessons.length - 1,
        duration: course.lessons
          .filter(l => l.id !== lesson.id)
          .reduce((sum, l) => sum + l.duration, 0)
      }
    });

    res.json({ message: 'Lesson deleted' });
  } catch (error) {
    next(error);
  }
});

// Category Management
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { courses: true }
        }
      }
    });

    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

router.post('/categories', async (req, res, next) => {
  try {
    const { name, slug, description, icon } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon
      }
    });

    res.status(201).json({
      message: 'Category created',
      category
    });
  } catch (error) {
    next(error);
  }
});

router.put('/categories/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.update({
      where: { id },
      data: req.body
    });

    res.json({
      message: 'Category updated',
      category
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/categories/:id', async (req, res, next) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
});

// User Management
router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        _count: {
          select: {
            enrollments: true,
            transactions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ users });
  } catch (error) {
    next(error);
  }
});

router.patch('/users/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { isActive: isActive === true || isActive === 'true' }
    });

    res.json({
      message: 'User status updated',
      user
    });
  } catch (error) {
    next(error);
  }
});

// Transaction Management
router.get('/transactions', async (req, res, next) => {
  try {
    const { status } = req.query;

    const where = status ? { status } : {};

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        course: {
          select: { id: true, title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ transactions });
  } catch (error) {
    next(error);
  }
});

router.patch('/transactions/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { course: true }
    });

    const updated = await prisma.transaction.update({
      where: { id },
      data: { status }
    });

    // If paid, create enrollment
    if (status === 'PAID' && transaction.courseId) {
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: transaction.userId,
            courseId: transaction.courseId
          }
        }
      });

      if (!existingEnrollment) {
        await prisma.enrollment.create({
          data: {
            userId: transaction.userId,
            courseId: transaction.courseId,
            status: 'NOT_STARTED',
            progress: 0
          }
        });

        await prisma.course.update({
          where: { id: transaction.courseId },
          data: {
            totalStudents: {
              increment: 1
            }
          }
        });
      }
    }

    res.json({
      message: 'Transaction status updated',
      transaction: updated
    });
  } catch (error) {
    next(error);
  }
});

export default router;

