import { User } from '../user/user.model';
import { Booking } from '../booking/booking.model';
import { Service } from '../service/service.model';
import { Review } from '../review/review.model';
import { Product } from '../product/product.model';
import { Order } from '../order/order.model';


export const getOverviewStats = async () => {
  const [users, services, bookings, reviews] = await Promise.all([
    User.countDocuments(),
    Service.countDocuments(),
    Booking.countDocuments(),
    Review.countDocuments(),
  ]);

  const revenue = await Booking.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  return {
    totalUsers: users,
    totalServices: services,
    totalBookings: bookings,
    totalReviews: reviews,
    totalRevenue: revenue[0]?.total || 0,
  };
};

export const getBookingsByMonth = async () =>
  Booking.aggregate([
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: '$totalPrice' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

export const getServiceCategoryBreakdown = async () =>
  Service.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

export const getBookingStatusBreakdown = async () =>
  Booking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

export const getTopServices = async () =>
  Booking.aggregate([
    { $group: { _id: '$service', bookings: { $sum: 1 } } },
    { $sort: { bookings: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: '_id',
        as: 'service',
      },
    },
    { $unwind: '$service' },
    {
      $project: {
        _id: 1,
        bookings: 1,
        title: '$service.title',
        image: '$service.image',
        price: '$service.price',
      },
    },
  ]);

export const getRecentBookings = async () =>
  Booking.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .populate('service', 'title')
    .lean();

    export const getProductStats = async () =>
  Product.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 }, stock: { $sum: '$stock' }, sold: { $sum: '$sold' } } },
  ]);

export const getOrderStats = async () =>
  Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$total' } } },
  ]);

export const getRevenueByMonth = async () =>
  Order.aggregate([
    { $match: { status: { $in: ['delivered', 'shipped'] } } },
    { $group: {
      _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
      revenue: { $sum: '$total' },
      orders: { $sum: 1 },
    }},
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

export const getTopSellingProducts = async () =>
  Product.find().sort({ sold: -1 }).limit(10).select('name images sold basePrice rating').lean();