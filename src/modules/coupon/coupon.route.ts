import { Router } from 'express';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { Coupon } from './coupon.model';
import { ApiError } from '../../utils/ApiError';

const router = Router();

// Public - validate coupon
router.get('/validate/:code', catchAsync(async (req, res) => {
  const coupon = await Coupon.findOne({ code: String(req.params.code).toUpperCase(), isActive: true });
  if (!coupon) throw new ApiError(404, 'Invalid coupon');
  if (new Date() > coupon.expiresAt) throw new ApiError(400, 'Expired');
  res.json(new ApiResponse('Coupon valid', coupon));
}));

router.use(protect, restrictTo('admin', 'manager'));

router.get('/', catchAsync(async (_req, res) => {
  res.json(new ApiResponse('Coupons', await Coupon.find().sort({ createdAt: -1 })));
}));

router.post('/', catchAsync(async (req, res) => {
  res.status(201).json(new ApiResponse('Created', await Coupon.create(req.body)));
}));

router.patch('/:id', catchAsync(async (req, res) => {
  const c = await Coupon.findByIdAndUpdate(String(req.params.id), req.body, { new: true });
  if (!c) throw new ApiError(404, 'Not found');
  res.json(new ApiResponse('Updated', c));
}));

router.delete('/:id', restrictTo('admin'), catchAsync(async (req, res) => {
  await Coupon.findByIdAndDelete(String(req.params.id));
  res.json(new ApiResponse('Deleted', null));
}));

export default router;