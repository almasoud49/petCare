import { Router } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { Newsletter } from './newsletter.model';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';

const router = Router();

router.post('/', catchAsync(async (req, res) => {
  const { email, name, preferences } = req.body;
  const existing = await Newsletter.findOne({ email });
  if (existing) {
    existing.isSubscribed = true;
    await existing.save();
    return res.json(new ApiResponse('Subscribed', existing));
  }
  const n = await Newsletter.create({ email, name, preferences });
  res.status(201).json(new ApiResponse('Subscribed', n));
}));

router.post('/unsubscribe/:email', catchAsync(async (req, res) => {
  await Newsletter.updateOne({ email: String(req.params.email) }, { isSubscribed: false });
  res.json(new ApiResponse('Unsubscribed', null));
}));

router.use(protect, restrictTo('admin', 'manager'));
router.get('/', catchAsync(async (_req, res) => {
  res.json(new ApiResponse('Subscribers', await Newsletter.find().sort({ createdAt: -1 })));
}));

export default router;