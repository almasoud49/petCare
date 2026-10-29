import { Router } from 'express';
import * as faqController from './faq.controller';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { validate } from '../../middleware/validate';
import { createFaqSchema, updateFaqSchema } from './faq.validator';

const router = Router();

router.get('/', faqController.list);

router.use(protect, restrictTo('admin'));
router.post('/', validate(createFaqSchema), faqController.create);
router.patch('/:id', validate(updateFaqSchema), faqController.update);
router.delete('/:id', faqController.remove);

export default router;