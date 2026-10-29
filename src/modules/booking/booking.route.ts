import { Router } from 'express';
import * as bookingController from './booking.controller';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { validate } from '../../middleware/validate';
import {
  createBookingSchema,
  updateStatusSchema,
  listBookingSchema,
} from './booking.validator';

const router = Router();
router.use(protect);

router.post('/', validate(createBookingSchema), bookingController.create);
router.get('/mine', validate(listBookingSchema), bookingController.listMine);
router.patch('/:id/cancel', bookingController.cancel);

router.get(
  '/',
  restrictTo('admin', 'manager'),
  validate(listBookingSchema),
  bookingController.listAll
);
router.patch(
  '/:id/status',
  restrictTo('admin', 'manager'),
  validate(updateStatusSchema),
  bookingController.updateStatus
);

export default router;