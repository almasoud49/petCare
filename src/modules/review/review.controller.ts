import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as reviewService from './review.service';

export const create = catchAsync(async (req: Request, res: Response) => {
  const review = await reviewService.createReview(req.user!.id, req.body);
  res.status(201).json(new ApiResponse('Review added', review));
});

export const list = catchAsync(async (req: Request, res: Response) => {
  const reviews = await reviewService.listReviews(req.params.serviceId as string);
  res.json(new ApiResponse('Reviews fetched', reviews));
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  await reviewService.deleteReview(req.params.id as string, req.user!.id);
  res.json(new ApiResponse('Review deleted', null));
});