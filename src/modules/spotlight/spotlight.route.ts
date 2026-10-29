import { Router } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { Spotlight } from './spotlight.model';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { ApiError } from '../../utils/ApiError';
import { getPagination } from '../../utils/pagination';

const router = Router();

router.get('/', catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query.page as string, req.query.limit as string);
  const [data, total] = await Promise.all([
    Spotlight.find({ isApproved: true })
      .populate('user', 'name avatar')
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Spotlight.countDocuments({ isApproved: true }),
  ]);
  res.json(new ApiResponse('Spotlights', data, { page, limit, total, totalPages: Math.ceil(total / limit) }));
}));

router.use(protect);

router.post('/', catchAsync(async (req, res) => {
  const spotlight = await Spotlight.create({ ...req.body, user: req.user!.id });
  res.status(201).json(new ApiResponse('Spotlight posted', spotlight));
}));

router.post('/:id/like', catchAsync(async (req, res) => {
  const spotlight = await Spotlight.findById(String(req.params.id));
  if (!spotlight) throw new ApiError(404, 'Not found');
  const idx = spotlight.likes.findIndex((u) => u.toString() === req.user!.id);
  if (idx >= 0) spotlight.likes.splice(idx, 1);
  else spotlight.likes.push(req.user!.id as any);
  await spotlight.save();
  res.json(new ApiResponse('Liked', { likes: spotlight.likes.length }));
}));

router.use(restrictTo('admin'));

router.patch('/:id/feature', catchAsync(async (req, res) => {
  const s = await Spotlight.findByIdAndUpdate(
    String(req.params.id),
    { isFeatured: req.body.isFeatured },
    { new: true }
  );
  res.json(new ApiResponse('Updated', s));
}));

router.delete('/:id', catchAsync(async (req, res) => {
  await Spotlight.findByIdAndDelete(String(req.params.id));
  res.json(new ApiResponse('Deleted', null));
}));

export default router;