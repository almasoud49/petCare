import { Router } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { Refund } from './refund.model';
import { Order } from '../order/order.model';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { ApiError } from '../../utils/ApiError';
import { getPagination } from '../../utils/pagination';
import { notify } from '../notification/notification.service';

const router = Router();
router.use(protect);

router.post('/', catchAsync(async (req, res) => {
  const { orderId, items, reason, description, images } = req.body;
  const order = await Order.findOne({ _id: orderId, user: req.user!.id });
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.status !== 'delivered')
    throw new ApiError(400, 'Only delivered orders can be refunded');

  const refund = await Refund.create({
    order: order._id,
    user: req.user!.id,
    items,
    reason,
    description,
    images: images || [],
    refundAmount: order.total,
  });

  res.status(201).json(new ApiResponse('Refund request submitted', refund));
}));

router.get('/mine', catchAsync(async (req, res) => {
  const refunds = await Refund.find({ user: req.user!.id })
    .populate('order', 'orderNumber total')
    .sort({ createdAt: -1 })
    .lean();
  res.json(new ApiResponse('My refunds', refunds));
}));

router.use(restrictTo('admin', 'manager'));

router.get('/', catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query.page as string, req.query.limit as string);
  const filter: any = {};
  if (req.query.status) filter.status = req.query.status;

  const [data, total] = await Promise.all([
    Refund.find(filter)
      .populate('user', 'name email')
      .populate('order', 'orderNumber total')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Refund.countDocuments(filter),
  ]);
  res.json(new ApiResponse('Refunds', data, { page, limit, total, totalPages: Math.ceil(total / limit) }));
}));

router.patch('/:id/status', catchAsync(async (req, res) => {
  const { status, adminNote } = req.body;
  const refund = await Refund.findByIdAndUpdate(
    String(req.params.id),
    { status, adminNote, resolvedAt: new Date() },
    { new: true }
  );
  if (!refund) throw new ApiError(404, 'Refund not found');

  await notify(
    refund.user.toString(),
    'order',
    'Refund ' + status,
    `Your refund request has been ${status}.`,
    `/refunds/${refund._id}`
  );

  res.json(new ApiResponse('Refund status updated', refund));
}));

export default router;