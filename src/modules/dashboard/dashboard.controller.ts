import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as dashboardService from './dashboard.service';

export const overview = catchAsync(async (_req: Request, res: Response) => {
  const stats = await dashboardService.getOverviewStats();
  res.json(new ApiResponse('Overview stats', stats));
});

export const charts = catchAsync(async (_req: Request, res: Response) => {
  const [bookingsByMonth, categoryBreakdown, statusBreakdown, topServices] =
    await Promise.all([
      dashboardService.getBookingsByMonth(),
      dashboardService.getServiceCategoryBreakdown(),
      dashboardService.getBookingStatusBreakdown(),
      dashboardService.getTopServices(),
    ]);

  res.json(
    new ApiResponse('Chart data', {
      bookingsByMonth,
      categoryBreakdown,
      statusBreakdown,
      topServices,
    })
  );
});

export const recentBookings = catchAsync(async (_req: Request, res: Response) => {
  const bookings = await dashboardService.getRecentBookings();
  res.json(new ApiResponse('Recent bookings', bookings));
});