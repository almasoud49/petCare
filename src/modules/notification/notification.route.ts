import { Router } from 'express';
import { protect } from '../../middleware/auth';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as s from './notification.service';

const router = Router();
router.use(protect);

router.get('/', catchAsync(async (req, res) => {
  res.json(new ApiResponse('Notifications', await s.listNotifications(req.user!.id)));
}));

router.get('/unread-count', catchAsync(async (req, res) => {
  res.json(new ApiResponse('Unread count', { count: await s.unreadCount(req.user!.id) }));
}));

router.patch('/:id/read', catchAsync(async (req, res) => {
  res.json(new ApiResponse('Marked read', await s.markAsRead(String(req.params.id), req.user!.id)));
}));

router.patch('/read-all', catchAsync(async (req, res) => {
  await s.markAllAsRead(req.user!.id);
  res.json(new ApiResponse('All marked read', null));
}));

export default router;