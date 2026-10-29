import { Review } from './review.model';
import { Service } from '../service/service.model';
import { ApiError } from '../../utils/ApiError';
import { Types } from 'mongoose';

export const createReview = async (
  userId: string,
  data: { service: string; rating: number; comment: string }
) => {
  const service = await Service.findById(data.service);
  if (!service) throw new ApiError(404, 'Service not found');

  const review = await Review.create({ ...data, user: userId });
  await refreshServiceRating(data.service);
  return review;
};

export const listReviews = async (serviceId: string) =>
  Review.find({ service: serviceId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .lean();

export const deleteReview = async (id: string, userId: string) => {
  const review = await Review.findOneAndDelete({ _id: id, user: userId });
  if (!review) throw new ApiError(404, 'Review not found');
  await refreshServiceRating(review.service.toString());
};

const refreshServiceRating = async (serviceId: string) => {
  const stats = await Review.aggregate([
    { $match: { service: new Types.ObjectId(serviceId) } },
    { $group: { _id: '$service', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await Service.findByIdAndUpdate(serviceId, {
    rating: Number((stats[0]?.avg || 0).toFixed(1)),
    reviewCount: stats[0]?.count || 0,
  });
};