import { Router } from 'express';
import * as blogController from './blog.controller';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { validate } from '../../middleware/validate';
import { createBlogSchema, updateBlogSchema } from './blog.validator';

const router = Router();

router.get('/', blogController.list);
router.get('/:slug', blogController.detail);

router.use(protect, restrictTo('admin', 'manager'));
router.post('/', validate(createBlogSchema), blogController.create);
router.patch('/:id', validate(updateBlogSchema), blogController.update);
router.delete('/:id', blogController.remove);

export default router;