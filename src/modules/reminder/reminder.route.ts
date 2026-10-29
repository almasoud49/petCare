import { Router } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { Reminder } from './reminder.model';
import { Pet } from '../pet/pet.model';
import { protect } from '../../middleware/auth';
import { ApiError } from '../../utils/ApiError';

const router = Router();
router.use(protect);

router.get('/', catchAsync(async (req, res) => {
  const reminders = await Reminder.find({ user: req.user!.id })
    .populate('pet', 'name image')
    .sort({ scheduledFor: 1 })
    .lean();
  res.json(new ApiResponse('My reminders', reminders));
}));

router.post('/', catchAsync(async (req, res) => {
  const { petId, type, title, message, scheduledFor, channel } = req.body;

  const pet = await Pet.findOne({ _id: petId, owner: req.user!.id });
  if (!pet) throw new ApiError(404, 'Pet not found');

  const reminder = await Reminder.create({
    user: req.user!.id,
    pet: pet._id,
    type,
    title,
    message,
    scheduledFor: new Date(scheduledFor),
    channel: channel || 'email',
  });

  res.status(201).json(new ApiResponse('Reminder created', reminder));
}));

router.delete('/:id', catchAsync(async (req, res) => {
  const reminder = await Reminder.findOneAndDelete({
    _id: String(req.params.id),
    user: req.user!.id,
  });
  if (!reminder) throw new ApiError(404, 'Reminder not found');
  res.json(new ApiResponse('Reminder deleted', null));
}));

export default router;