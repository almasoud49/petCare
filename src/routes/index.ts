import { Router } from 'express';

// Existing modules
import authRoute from '../modules/auth/auth.route';
import userRoute from '../modules/user/user.route';
import petRoute from '../modules/pet/pet.route';
import serviceRoute from '../modules/service/service.route';
import bookingRoute from '../modules/booking/booking.route';
import reviewRoute from '../modules/review/review.route';
import blogRoute from '../modules/blog/blog.route';
import contactRoute from '../modules/contact/contact.route';
import faqRoute from '../modules/faq/faq.route';
import dashboardRoute from '../modules/dashboard/dashboard.route';
import aiRoute from '../modules/ai/ai.route';

// New modules
import productRoute from '../modules/product/product.route';
import categoryRoute from '../modules/category/category.route';
import cartRoute from '../modules/cart/cart.route';
import orderRoute from '../modules/order/order.route';
import couponRoute from '../modules/coupon/coupon.route';
import wishlistRoute from '../modules/wishlist/wishlist.route';
import newsletterRoute from '../modules/newsletter/newsletter.route';
import notificationRoute from '../modules/notification/notification.route';
import petTagRoute from '../modules/petTag/petTag.route';
import lostFoundRoute from '../modules/lostFound/lostFound.route';
import adoptionRoute from '../modules/adoption/adoption.route';
import deliveryRoute from '../modules/delivery/delivery.route';
import blogInteractionRoute from '../modules/blogInteraction/blogInteraction.route';
import loyaltyRoute from '../modules/loyalty/loyalty.route';
import symptomCheckerRoute from '../modules/symptomChecker/symptomChecker.route';
import subscriptionRoute from '../modules/subscription/subscription.route';
import quizRoute from '../modules/quiz/quiz.route';
import bundleRoute from '../modules/bundle/bundle.route';
import areaRoute from '../modules/area/area.route';
import emergencyRoute from '../modules/emergency/emergency.route';
import refundRoute from '../modules/refund/refund.route';
import reminderRoute from '../modules/reminder/reminder.route';
import analyticsRoute from '../modules/analytics/analytics.route';
import spotlightRoute from '../modules/spotlight/spotlight.route';
import paymentRoute from '../modules/payment/payment.route';


const router = Router();

// ─── Existing ────────────────────────────────────────
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/pets', petRoute);
router.use('/services', serviceRoute);
router.use('/bookings', bookingRoute);
router.use('/reviews', reviewRoute);
router.use('/blogs', blogRoute);
router.use('/contacts', contactRoute);
router.use('/faqs', faqRoute);
router.use('/dashboard', dashboardRoute);
router.use('/ai', aiRoute);

// ─── Shop ────────────────────────────────────────────
router.use('/products', productRoute);
router.use('/categories', categoryRoute);
router.use('/cart', cartRoute);
router.use('/orders', orderRoute);
router.use('/coupons', couponRoute);
router.use('/wishlist', wishlistRoute);
router.use('/delivery-zones', deliveryRoute);

// ─── Engagement ──────────────────────────────────────
router.use('/newsletter', newsletterRoute);
router.use('/notifications', notificationRoute);
router.use('/blog-interactions', blogInteractionRoute);
router.use('/loyalty', loyaltyRoute);

// ─── Community ───────────────────────────────────────
router.use('/pet-tags', petTagRoute);
router.use('/lost-found', lostFoundRoute);
router.use('/adoptions', adoptionRoute);

// ─── AI + Payments ───────────────────────────────────
router.use('/symptom-checker', symptomCheckerRoute);
router.use('/payments', paymentRoute);

router.use('/subscriptions', subscriptionRoute);
router.use('/quiz', quizRoute);
router.use('/bundles', bundleRoute);
router.use('/areas', areaRoute);
router.use('/emergency-vets', emergencyRoute);
router.use('/refunds', refundRoute);
router.use('/reminders', reminderRoute);
router.use('/analytics', analyticsRoute);
router.use('/spotlights', spotlightRoute);

export default router;