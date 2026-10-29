import { Router } from 'express';
import * as petController from './pet.controller';
import { protect } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createPetSchema, updatePetSchema } from './pet.validator';

const router = Router();
router.use(protect);

router.route('/')
  .get(petController.listMine)
  .post(validate(createPetSchema), petController.create);

router.route('/:id')
  .get(petController.detail)
  .patch(validate(updatePetSchema), petController.update)
  .delete(petController.remove);

export default router;