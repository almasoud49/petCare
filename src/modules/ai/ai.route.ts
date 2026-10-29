import { Router } from 'express';
import * as aiController from './ai.controller';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { validate } from '../../middleware/validate';
import { chatSchema, suggestSearchSchema } from './ai.validator';
import { aiLimiter } from '../../middleware/rateLimit';

const router = Router();

router.post('/chat', aiLimiter, validate(chatSchema), aiController.chat);
router.get('/suggest', validate(suggestSearchSchema), aiController.suggest);
router.get('/recommendations', aiController.recommendations);
router.get('/trending', aiController.trending);
router.post(
  '/blog-ideas',
  protect,
  restrictTo('admin', 'manager'),
  aiController.blogIdeas
);

export default router;