import { Router } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { Area } from './area.model';
import { Service } from '../service/service.model';
import { Product } from '../product/product.model';
import { ApiError } from '../../utils/ApiError';

const router = Router();

router.get('/', catchAsync(async (_req, res) => {
  const areas = await Area.find({ isActive: true }).lean();
  res.json(new ApiResponse('Areas', areas));
}));

router.get('/:slug', catchAsync(async (req, res) => {
  const area = await Area.findOne({ slug: String(req.params.slug), isActive: true }).lean();
  if (!area) throw new ApiError(404, 'Area not found');

  const [services, products] = await Promise.all([
    Service.find({
      location: new RegExp(area.name, 'i'),
      isActive: true,
    })
      .sort({ rating: -1 })
      .limit(12)
      .lean(),
    Product.find({ isActive: true }).sort({ sold: -1 }).limit(8).lean(),
  ]);

  res.json(new ApiResponse('Area detail', { area, services, products }));
}));

export default router;