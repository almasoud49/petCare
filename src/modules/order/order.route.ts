import { Router } from 'express';
import * as c from './order.controller';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { validate } from '../../middleware/validate';
import { placeOrderSchema, updateStatusSchema } from './order.validator';

const router = Router();
router.use(protect);

router.post('/', validate(placeOrderSchema), c.place);
router.get('/mine', c.listMine);
router.get('/:id', c.detailMine);
router.patch('/:id/cancel', c.cancel);

router.use(restrictTo('admin', 'manager'));
router.get('/', c.listAll);
router.patch('/:id/status', validate(updateStatusSchema), c.updateStatus);

export default router;