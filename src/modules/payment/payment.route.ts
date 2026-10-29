import { Router } from 'express';
import * as c from './payment.controller';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { validate } from '../../middleware/validate';
import { initiatePaymentSchema, refundSchema } from './payment.validator';

const router = Router();

// ─── Public gateway callbacks ─────────────────────────
router.post('/sslcommerz/success', c.sslSuccess);
router.post('/sslcommerz/fail', c.sslFail);
router.post('/sslcommerz/cancel', c.sslCancel);
router.post('/sslcommerz/ipn', c.sslIpn);
router.get('/bkash/callback', c.bkashCallback);

// ─── Authenticated ────────────────────────────────────
router.post(
  '/initiate',
  protect,
  validate(initiatePaymentSchema),
  c.initiate
);
router.post('/mock/:txn/confirm', protect, c.mockConfirm);

// ─── Admin ────────────────────────────────────────────
router.get('/', protect, restrictTo('admin', 'manager'), c.list);
router.post(
  '/:id/refund',
  protect,
  restrictTo('admin'),
  validate(refundSchema),
  c.refund
);

export default router;