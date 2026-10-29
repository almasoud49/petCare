import { Router } from 'express';
import * as contactController from './contact.controller';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { validate } from '../../middleware/validate';
import { createContactSchema } from './contact.validator';

const router = Router();

router.post('/', validate(createContactSchema), contactController.create);

router.use(protect, restrictTo('admin', 'manager'));
router.get('/', contactController.list);
router.patch('/:id/status', contactController.updateStatus);

export default router;