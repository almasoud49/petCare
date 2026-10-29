import { Router } from 'express';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { DeliveryZone } from './delivery.model';

const router = Router();

router.get('/', catchAsync(async (_req, res) => {
  res.json(new ApiResponse('Zones', await DeliveryZone.find({ isActive: true })));
}));

router.get('/check', catchAsync(async (req, res) => {
  const { city } = req.query;
  const zone = await DeliveryZone.findOne({ cities: city as string, isActive: true });
  res.json(new ApiResponse('Zone', zone || null));
}));

router.use(protect, restrictTo('admin', 'manager'));
router.post('/', catchAsync(async (req, res) => {
  res.status(201).json(new ApiResponse('Created', await DeliveryZone.create(req.body)));
}));
router.patch('/:id', catchAsync(async (req, res) => {
  const z = await DeliveryZone.findByIdAndUpdate(String(req.params.id), req.body, { new: true });
  res.json(new ApiResponse('Updated', z));
}));

export default router;