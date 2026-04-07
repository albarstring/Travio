import express from 'express';
import {
  updateProgress,
  getProgress
} from '../controllers/progress.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', updateProgress);
router.get('/:courseId', getProgress);

export default router;

