import express from 'express';
import {
  enrollCourse,
  getMyEnrollments,
  getEnrollment
} from '../controllers/enrollment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', enrollCourse);
router.get('/', getMyEnrollments);
router.get('/:courseId', getEnrollment);

export default router;

