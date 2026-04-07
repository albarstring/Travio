import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middlewares/auth.middleware.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticate);

// Create transaction
router.post('/', async (req, res, next) => {
  try {
    const { courseId, amount, paymentMethod } = req.body;
    const userId = req.user.id;

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        courseId,
        amount: parseFloat(amount),
        paymentMethod,
        status: 'PENDING'
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Transaction created',
      transaction
    });
  } catch (error) {
    next(error);
  }
});

// Get user transactions
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const where = {
      userId,
      ...(status && { status })
    };

    const transactions = await prisma.transaction.findMany({
      where,
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
      orderBy: { createdAt: 'desc' }
    });

    res.json({ transactions });
  } catch (error) {
    next(error);
  }
});

// Update transaction status (for payment confirmation)
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, paymentProof } = req.body;
    const userId = req.user.id;

    const transaction = await prisma.transaction.findUnique({
      where: { id }
    });

    if (!transaction || transaction.userId !== userId) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        status,
        ...(paymentProof && { paymentProof })
      }
    });

    // If paid, create enrollment
    if (status === 'PAID' && transaction.courseId) {
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: transaction.courseId
          }
        }
      });

      if (!existingEnrollment) {
        await prisma.enrollment.create({
          data: {
            userId,
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
      message: 'Transaction updated',
      transaction: updated
    });
  } catch (error) {
    next(error);
  }
});

export default router;

