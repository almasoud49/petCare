import { Router } from 'express';
import { protect } from '../../middleware/auth';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { Wishlist } from './wishlist.model';
import { Product } from '../product/product.model';
import { ApiError } from '../../utils/ApiError';
import { Types } from 'mongoose';

const router = Router();
router.use(protect);

router.get('/', catchAsync(async (req, res) => {
  const wl = await Wishlist.findOne({ user: req.user!.id }).populate('items.product');
  res.json(new ApiResponse('Wishlist', wl?.items || []));
}));

router.post('/:productId', catchAsync(async (req, res) => {
  const product = await Product.findById(String(req.params.productId));
  if (!product) throw new ApiError(404, 'Product not found');
  let wl = await Wishlist.findOne({ user: req.user!.id });
  if (!wl) wl = await Wishlist.create({ user: req.user!.id, items: [] });
  const exists = wl.items.some((i) => i.product.toString() === String(req.params.productId));
  if (exists) throw new ApiError(400, 'Already in wishlist');
  wl.items.push({ product: product._id, addedAt: new Date() });
  await wl.save();
  res.json(new ApiResponse('Added to wishlist', wl));
}));

router.delete('/:productId', catchAsync(async (req, res) => {
  const wl = await Wishlist.findOneAndUpdate(
    { user: req.user!.id },
    { $pull: { items: { product: new Types.ObjectId(String(req.params.productId)) } } },
    { new: true }
  );
  res.json(new ApiResponse('Removed', wl));
}));

export default router;