import { Router } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { Emergency } from './emergency.model';

const router = Router();

router.get('/', catchAsync(async (req, res) => {
  const filter: any = { isActive: true };
  if (req.query.area) filter.area = new RegExp(String(req.query.area), 'i');
  if (req.query.city) filter.city = new RegExp(String(req.query.city), 'i');
  if (req.query.is24_7 === 'true') filter.is24_7 = true;

  const data = await Emergency.find(filter).lean();
  res.json(new ApiResponse('Emergency vets', data));
}));

export default router;