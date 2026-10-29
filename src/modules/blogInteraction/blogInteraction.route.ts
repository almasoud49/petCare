import { Router } from 'express';
import { protect } from '../../middleware/auth';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { BlogLike, BlogComment } from './blogInteraction.model';

const router = Router();

router.get('/:blogId/comments', catchAsync(async (req, res) => {
  const comments = await BlogComment.find({ blog: String(req.params.blogId) })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .lean();
  res.json(new ApiResponse('Comments', comments));
}));

router.get('/:blogId/likes', catchAsync(async (req, res) => {
  const count = await BlogLike.countDocuments({ blog: String(req.params.blogId) });
  res.json(new ApiResponse('Likes', { count }));
}));

router.use(protect);

router.post('/:blogId/like', catchAsync(async (req, res) => {
  const existing = await BlogLike.findOne({ user: req.user!.id, blog: String(req.params.blogId) });
  if (existing) {
    await existing.deleteOne();
    return res.json(new ApiResponse('Unliked', { liked: false }));
  }
  await BlogLike.create({ user: req.user!.id, blog: String(req.params.blogId) });
  res.json(new ApiResponse('Liked', { liked: true }));
}));

router.post('/:blogId/comments', catchAsync(async (req, res) => {
  const comment = await BlogComment.create({
    user: req.user!.id,
    blog: String(req.params.blogId),
    content: req.body.content,
    parent: req.body.parent,
  });
  res.status(201).json(new ApiResponse('Comment added', comment));
}));

router.delete('/comments/:id', catchAsync(async (req, res) => {
  await BlogComment.findOneAndDelete({ _id: String(req.params.id), user: req.user!.id });
  res.json(new ApiResponse('Comment deleted', null));
}));

export default router;