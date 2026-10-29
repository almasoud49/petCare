import { Router } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { AnalyticsEvent } from './analytics.model';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';

const router = Router();

// Public — frontend sends events
router.post('/track', catchAsync(async (req, res) => {
  const { event, sessionId, path, metadata } = req.body;
  if (!event || !sessionId) return res.status(400).json({ success: false });

  await AnalyticsEvent.create({
    event,
    userId: req.body.userId,
    sessionId,
    path,
    metadata,
  });
  res.json(new ApiResponse('Tracked', null));
}));

// Admin
router.use(protect, restrictTo('admin', 'manager'));

router.get('/summary', catchAsync(async (req, res) => {
  const days = Number(req.query.days) || 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const events = await AnalyticsEvent.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: '$event', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const daily = await AnalyticsEvent.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(new ApiResponse('Analytics summary', { events, daily }));
}));

export default router;