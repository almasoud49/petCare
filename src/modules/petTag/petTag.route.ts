import { Router } from 'express';
import { protect } from '../../middleware/auth';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { PetTag } from './petTag.model';
import { Pet } from '../pet/pet.model';
import { ApiError } from '../../utils/ApiError';

const router = Router();

// Public scan endpoint - shows owner contact for lost pet
router.get('/scan/:code', catchAsync(async (req, res) => {
  const tag = await PetTag.findOne({ tagCode: String(req.params.code), isActive: true })
    .populate('pet', 'name species breed image')
    .populate('owner', 'name phone email')
    .lean();
  if (!tag) throw new ApiError(404, 'Tag not found or inactive');

  await PetTag.updateOne({ _id: tag._id }, { $inc: { scans: 1 }, lastScannedAt: new Date() });
  res.json(new ApiResponse('Tag scanned', tag));
}));

router.use(protect);

router.get('/', catchAsync(async (req, res) => {
  const tags = await PetTag.find({ owner: req.user!.id }).populate('pet', 'name image');
  res.json(new ApiResponse('My tags', tags));
}));

router.post('/pet/:petId', catchAsync(async (req, res) => {
  const pet = await Pet.findOne({ _id: String(req.params.petId), owner: req.user!.id });
  if (!pet) throw new ApiError(404, 'Pet not found');
  const tag = await PetTag.create({ pet: pet._id, owner: req.user!.id });
  res.status(201).json(new ApiResponse('Tag created', tag));
}));

router.patch('/:id/deactivate', catchAsync(async (req, res) => {
  const tag = await PetTag.findOneAndUpdate(
    { _id: String(req.params.id), owner: req.user!.id },
    { isActive: false },
    { new: true }
  );
  if (!tag) throw new ApiError(404, 'Tag not found');
  res.json(new ApiResponse('Tag deactivated', tag));
}));

export default router;