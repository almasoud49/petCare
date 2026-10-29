import { Router } from 'express';
import * as productController from './product.controller';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { validate } from '../../middleware/validate';
import {
  createProductSchema,
  updateProductSchema,
  listProductSchema,
} from './product.validator';

const router = Router();

// Public
router.get('/', validate(listProductSchema), productController.list);
router.get('/flash-sale', productController.flashSale);
router.get('/featured', productController.featured);
router.get('/:slug', productController.detail);

// Protected (admin / manager)
router.use(protect, restrictTo('admin', 'manager'));
router.post('/', validate(createProductSchema), productController.create);
router.patch('/:id', validate(updateProductSchema), productController.update);
router.delete('/:id', restrictTo('admin'), productController.remove);

export default router;