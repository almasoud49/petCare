import { Booking } from './booking.model';
import { Service } from '../service/service.model';
import { Pet } from '../pet/pet.model';
import { ApiError } from '../../utils/ApiError';
import { getPagination } from '../../utils/pagination';
import { CreateBookingInput } from './booking.interface';

export const createBooking = async (userId: string, data: CreateBookingInput) => {
  const service = await Service.findById(data.service);
  if (!service) throw new ApiError(404, 'Service not found');

  const pet = await Pet.findOne({ _id: data.pet, owner: userId });
  if (!pet) throw new ApiError(404, 'Pet not found or not owned by you');

  const booking = await Booking.create({
    user: userId,
    service: service._id,
    pet: pet._id,
    date: new Date(data.date),
    timeSlot: data.timeSlot,
    notes: data.notes,
    totalPrice: service.price,
  });

  return booking.populate(['service', 'pet']);
};

export const listUserBookings = async (
  userId: string,
  q: { page?: string; limit?: string; status?: string }
) => {
  const { page, limit, skip } = getPagination(q.page, q.limit);
  const filter: any = { user: userId };
  if (q.status) filter.status = q.status;

  const [data, total] = await Promise.all([
    Booking.find(filter)
      .populate('service', 'title image price category')
      .populate('pet', 'name species image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const listAllBookings = async (q: {
  page?: string;
  limit?: string;
  status?: string;
}) => {
  const { page, limit, skip } = getPagination(q.page, q.limit);
  const filter: any = {};
  if (q.status) filter.status = q.status;

  const [data, total] = await Promise.all([
    Booking.find(filter)
      .populate('user', 'name email')
      .populate('service', 'title price')
      .populate('pet', 'name species')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const updateBookingStatus = async (id: string, status: string) => {
  const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
  if (!booking) throw new ApiError(404, 'Booking not found');
  return booking;
};

export const cancelBooking = async (id: string, userId: string) => {
  const booking = await Booking.findOneAndUpdate(
    { _id: id, user: userId, status: { $in: ['pending', 'confirmed'] } },
    { status: 'cancelled' },
    { new: true }
  );
  if (!booking) throw new ApiError(404, 'Booking not found or cannot be cancelled');
  return booking;
};