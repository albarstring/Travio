import express from 'express';
import {
  getCourses,
  getCourse,
  getFeaturedCourses
} from '../controllers/course.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedCourses);
router.get('/', getCourses);
router.get('/:slug', authenticate, getCourse); // Optional auth for enrollment check

export default router;

