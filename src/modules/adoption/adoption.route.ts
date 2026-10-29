import { Router } from 'express';
import { protect } from '../../middleware/auth';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { Adoption } from './adoption.model';
import { ApiError } from '../../utils/ApiError';
import { getPagination } from '../../utils/pagination';
import { notify } from '../notification/notification.service';

const router = Router();

router.get('/', catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query.page as string, req.query.limit as string);
  const filter: any = { status: 'available' };
  if (req.query.species) filter.species = req.query.species;
  if (req.query.location) filter.location = new RegExp(String(req.query.location), 'i');

  const [data, total] = await Promise.all([
    Adoption.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Adoption.countDocuments(filter),
  ]);
  res.json(new ApiResponse('Adoptions', data, {
    page, limit, total, totalPages: Math.ceil(total / limit),
  }));
}));

router.get('/:id', catchAsync(async (req, res) => {
  const post = await Adoption.findById(String(req.params.id)).populate('poster', 'name email');
  if (!post) throw new ApiError(404, 'Not found');
  res.json(new ApiResponse('Adoption detail', post));
}));

router.use(protect);

router.post('/', catchAsync(async (req, res) => {
  const post = await Adoption.create({ ...req.body, poster: req.user!.id });
  res.status(201).json(new ApiResponse('Posted', post));
}));

router.post('/:id/apply', catchAsync(async (req, res) => {
  const post = await Adoption.findById(String(req.params.id));
  if (!post) throw new ApiError(404, 'Not found');
  if (post.applications.some((a) => a.toString() === req.user!.id))
    throw new ApiError(400, 'You have already applied');
  post.applications.push(req.user!.id as any);
  post.status = 'pending';
  await post.save();

  await notify(
    post.poster.toString(),
    'system',
    'New adoption application',
    `Someone applied to adopt ${post.petName}`,
    `/adoptions/${post._id}`
  );

  res.json(new ApiResponse('Application submitted', post));
}));

router.patch('/:id/status', catchAsync(async (req, res) => {
  const post = await Adoption.findOneAndUpdate(
    { _id: String(req.params.id), poster: req.user!.id },
    { status: req.body.status },
    { new: true }
  );
  if (!post) throw new ApiError(404, 'Not found');
  res.json(new ApiResponse('Status updated', post));
}));

export default router;