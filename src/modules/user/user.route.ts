import { Router } from 'express';
import * as userController from './user.controller';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { validate } from '../../middleware/validate';
import {
  updateUserSchema,
  changePasswordSchema,
  listUserSchema,
} from './user.validator';

const router = Router();

// Self
router.get('/me', protect, userController.getProfile);
router.patch('/me', protect, validate(updateUserSchema), userController.updateProfile);
router.patch('/me/password', protect, validate(changePasswordSchema), userController.changePassword);

// Admin
router.get('/', protect, restrictTo('admin'), validate(listUserSchema), userController.listUsers);
router.patch('/:id/toggle', protect, restrictTo('admin'), userController.toggleStatus);
router.delete('/:id', protect, restrictTo('admin'), userController.removeUser);

export default router;