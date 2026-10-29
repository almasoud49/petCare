import { Router } from 'express';
import * as serviceController from './service.controller';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { validate } from '../../middleware/validate';
import {
  createServiceSchema,
  updateServiceSchema,
  listServiceSchema,
} from './service.validator';

const router = Router();

router.get('/', validate(listServiceSchema), serviceController.list);
router.get('/:id', serviceController.detail);

router.post(
  '/',
  protect,
  restrictTo('admin', 'manager'),
  validate(createServiceSchema),
  serviceController.create
);
router.patch(
  '/:id',
  protect,
  restrictTo('admin', 'manager'),
  validate(updateServiceSchema),
  serviceController.update
);
router.delete('/:id', protect, restrictTo('admin'), serviceController.remove);

export default router;