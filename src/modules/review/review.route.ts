import { Router } from 'express';
import * as reviewController from './review.controller';
import { protect } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createReviewSchema } from './review.validator';

const router = Router();

router.get('/service/:serviceId', reviewController.list);

router.use(protect);
router.post('/', validate(createReviewSchema), reviewController.create);
router.delete('/:id', reviewController.remove);

export default router;