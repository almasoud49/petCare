import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as bookingService from './booking.service';

export const create = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.createBooking(req.user!.id, req.body);
  res.status(201).json(new ApiResponse('Booking created', booking));
});

export const listMine = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.listUserBookings(req.user!.id, req.query as any);
  res.json(new ApiResponse('Bookings fetched', result.data, result.meta));
});

export const listAll = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.listAllBookings(req.query as any);
  res.json(new ApiResponse('All bookings', result.data, result.meta));
});

export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.updateBookingStatus(req.params.id as string, req.body.status);
  res.json(new ApiResponse('Status updated', booking));
});

export const cancel = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.cancelBooking(req.params.id as string, req.user!.id);
  res.json(new ApiResponse('Booking cancelled', booking));
});