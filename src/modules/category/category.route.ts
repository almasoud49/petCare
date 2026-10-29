import { Router } from 'express';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as c from './category.service';

const router = Router();

router.get('/', catchAsync(async (_req, res) => {
  res.json(new ApiResponse('Categories', await c.listCategories()));
}));

router.get('/tree', catchAsync(async (_req, res) => {
  res.json(new ApiResponse('Category tree', await c.getCategoryTree()));
}));

router.use(protect, restrictTo('admin', 'manager'));
router.post('/', catchAsync(async (req, res) => {
  res.status(201).json(new ApiResponse('Created', await c.createCategory(req.body)));
}));
router.patch('/:id', catchAsync(async (req, res) => {
  res.json(new ApiResponse('Updated', await c.updateCategory(String(req.params.id), req.body)));
}));
router.delete('/:id', restrictTo('admin'), catchAsync(async (req, res) => {
  await c.deleteCategory(String(req.params.id));
  res.json(new ApiResponse('Deleted', null));
}));

export default router;