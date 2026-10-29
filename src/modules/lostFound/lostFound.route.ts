import { Router } from 'express';
import { protect } from '../../middleware/auth';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { LostFound } from './lostFound.model';
import { ApiError } from '../../utils/ApiError';
import { getPagination } from '../../utils/pagination';

const router = Router();

// Public browsing
router.get('/', catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query.page as string, req.query.limit as string);
  const filter: any = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.species) filter.species = req.query.species;
  if (req.query.search)
    filter.$text = { $search: String(req.query.search) };

  const [data, total] = await Promise.all([
    LostFound.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    LostFound.countDocuments(filter),
  ]);
  res.json(new ApiResponse('Lost & found posts', data, {
    page, limit, total, totalPages: Math.ceil(total / limit),
  }));
}));

router.get('/:id', catchAsync(async (req, res) => {
  const post = await LostFound.findById(String(req.params.id)).populate('reporter', 'name email');
  if (!post) throw new ApiError(404, 'Post not found');
  res.json(new ApiResponse('Post detail', post));
}));

router.use(protect);

router.post('/', catchAsync(async (req, res) => {
  const post = await LostFound.create({ ...req.body, reporter: req.user!.id });
  res.status(201).json(new ApiResponse('Post created', post));
}));

router.patch('/:id/resolve', catchAsync(async (req, res) => {
  const post = await LostFound.findOneAndUpdate(
    { _id: String(req.params.id), reporter: req.user!.id },
    { status: 'reunited', resolvedAt: new Date() },
    { new: true }
  );
  if (!post) throw new ApiError(404, 'Post not found');
  res.json(new ApiResponse('Marked as reunited', post));
}));

router.delete('/:id', catchAsync(async (req, res) => {
  await LostFound.findOneAndDelete({ _id: String(req.params.id), reporter: req.user!.id });
  res.json(new ApiResponse('Deleted', null));
}));

export default router;