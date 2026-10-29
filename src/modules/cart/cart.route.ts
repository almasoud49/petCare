// cart.route.ts
import { Router } from 'express';
import * as cartController from './cart.controller';
import { protect } from '../../middleware/auth';

const router = Router();
router.use(protect);

router.get('/', cartController.get);
router.post('/add', cartController.add);
router.patch('/items/:itemId', cartController.update);
router.delete('/items/:itemId', cartController.remove);
router.post('/apply-coupon', cartController.applyCoupon);
router.delete('/coupon', cartController.removeCoupon);
router.delete('/', cartController.clear);

export default router;