import { Router } from 'express';
import * as c from './subscription.controller';
import { protect } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createSubscriptionSchema } from './subscription.validator';

const router = Router();
router.use(protect);

router.post('/', validate(createSubscriptionSchema), c.create);
router.get('/', c.list);
router.patch('/:id/pause', c.pause);
router.patch('/:id/resume', c.resume);
router.patch('/:id/cancel', c.cancel);

export default router;