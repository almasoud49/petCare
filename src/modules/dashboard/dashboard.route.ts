import { Router } from 'express';
import * as dashboardController from './dashboard.controller';
import { protect } from '../../middleware/auth';
import { restrictTo } from '../../middleware/role';
import { User } from '../user/user.model';
import { Pet } from '../pet/pet.model';
import { Service } from '../service/service.model';
import { Booking } from '../booking/booking.model';
import { Review } from '../review/review.model';
import { Product } from '../product/product.model';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';

const router = Router();
router.get('/public-stats', catchAsync(async (_req, res) => {
  const [totalUsers, totalPets, totalServices, totalBookings, totalReviews, totalProducts, avg] =
    await Promise.all([
      User.countDocuments({ role: 'user' }),
      Pet.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Review.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Review.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]),
    ]);

  res.json(new ApiResponse('Public stats', {
    totalUsers,
    totalPets,
    totalServices,
    totalBookings,
    totalReviews,
    totalProducts,
    avgRating: avg[0]?.avg ? Number(avg[0].avg.toFixed(1)) : 4.9,
  }));
}));

router.use(protect, restrictTo('admin', 'manager'));

router.get('/overview', dashboardController.overview);
router.get('/charts', dashboardController.charts);
router.get('/recent-bookings', dashboardController.recentBookings);

export default router;