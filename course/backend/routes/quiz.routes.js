import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middlewares/auth.middleware.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticate);

// Get quiz with questions
router.get('/:quizId', async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: {
          include: {
            enrollments: {
              where: { userId }
            }
          }
        },
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            question: true,
            type: true,
            options: true,
            points: true,
            order: true
            // Don't include correctAnswer
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check enrollment
    const enrollment = quiz.course.enrollments[0];
    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    res.json({ quiz });
  } catch (error) {
    next(error);
  }
});

// Submit quiz
router.post('/:quizId/submit', async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // { questionId: "answer" }
    const userId = req.user.id;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let score = 0;
    let totalScore = 0;
    const answerDetails = {};

    for (const question of quiz.questions) {
      totalScore += question.points;
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;

      answerDetails[question.id] = {
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0
      };

      if (isCorrect) {
        score += question.points;
      }
    }

    const percentage = (score / totalScore) * 100;
    const passed = percentage >= quiz.passingScore;

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        totalScore,
        percentage,
        passed,
        answers: answerDetails
      }
    });

    // Create activity
    await prisma.activity.create({
      data: {
        userId,
        type: 'quiz_completed',
        description: `Completed quiz: ${quiz.title} - ${passed ? 'Passed' : 'Failed'}`
      }
    });

    res.json({
      message: 'Quiz submitted',
      attempt: {
        ...attempt,
        answerDetails
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get quiz attempts history
router.get('/:quizId/attempts', async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
        quizId
      },
      orderBy: { completedAt: 'desc' }
    });

    res.json({ attempts });
  } catch (error) {
    next(error);
  }
});

export default router;

