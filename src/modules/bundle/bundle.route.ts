import { Router } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { Bundle } from './bundle.model';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { ApiError } from '../../utils/ApiError';
import { getPagination } from '../../utils/pagination';

const router = Router();

router.get('/', catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query.page as string, req.query.limit as string);
  const filter: any = {
    isActive: true,
    $or: [{ validUntil: { $gte: new Date() } }, { validUntil: { $exists: false } }],
  };

  const [data, total] = await Promise.all([
    Bundle.find(filter)
      .populate('products.product', 'name images brand basePrice')
      .sort({ discountPercent: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Bundle.countDocuments(filter),
  ]);

  res.json(new ApiResponse('Bundles', data, {
    page, limit, total, totalPages: Math.ceil(total / limit),
  }));
}));

router.get('/:slug', catchAsync(async (req, res) => {
  const bundle = await Bundle.findOne({ slug: String(req.params.slug), isActive: true })
    .populate('products.product', 'name images brand basePrice variants');
  if (!bundle) throw new ApiError(404, 'Bundle not found');
  res.json(new ApiResponse('Bundle detail', bundle));
}));

router.use(protect, restrictTo('admin', 'manager'));

router.post('/', catchAsync(async (req, res) => {
  const bundle = await Bundle.create(req.body);
  res.status(201).json(new ApiResponse('Bundle created', bundle));
}));

router.patch('/:id', catchAsync(async (req, res) => {
  const bundle = await Bundle.findByIdAndUpdate(String(req.params.id), req.body, { new: true });
  if (!bundle) throw new ApiError(404, 'Bundle not found');
  res.json(new ApiResponse('Bundle updated', bundle));
}));

router.delete('/:id', restrictTo('admin'), catchAsync(async (req, res) => {
  await Bundle.findByIdAndDelete(String(req.params.id));
  res.json(new ApiResponse('Bundle deleted', null));
}));

export default router;