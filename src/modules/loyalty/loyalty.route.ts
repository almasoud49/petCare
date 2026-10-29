import { Router } from 'express';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as s from './loyalty.service';
import { Loyalty } from './loyalty.model';

const router = Router();
router.use(protect);

router.get('/me', catchAsync(async (req, res) => {
  res.json(new ApiResponse('Loyalty', await s.getOrCreate(req.user!.id)));
}));

router.post('/redeem', catchAsync(async (req, res) => {
  const l = await s.redeem(req.user!.id, req.body.points);
  res.json(new ApiResponse('Redeemed', l));
}));

router.use(restrictTo('admin', 'manager'));
router.get('/', catchAsync(async (_req, res) => {
  res.json(new ApiResponse('All loyalty', await Loyalty.find().populate('user', 'name email')));
}));

router.post('/:userId/points', catchAsync(async (req, res) => {
  const l = await s.addPoints(String(req.params.userId), req.body.points, req.body.reason, req.body.amountSpent || 0);
  res.json(new ApiResponse('Points added', l));
}));

export default router;