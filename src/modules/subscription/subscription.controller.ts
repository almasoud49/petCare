import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as s from './subscription.service';

export const create = catchAsync(async (req, res) => {
  const sub = await s.createSubscription(req.user!.id, req.body);
  res.status(201).json(new ApiResponse('Subscription created', sub));
});

export const list = catchAsync(async (req, res) => {
  const result = await s.listSubscriptions(req.user!.id, req.query);
  res.json(new ApiResponse('Subscriptions', result.data, result.meta));
});

export const pause = catchAsync(async (req, res) => {
  const sub = await s.pauseSubscription(String(req.params.id), req.user!.id);
  res.json(new ApiResponse('Paused', sub));
});

export const resume = catchAsync(async (req, res) => {
  const sub = await s.resumeSubscription(String(req.params.id), req.user!.id);
  res.json(new ApiResponse('Resumed', sub));
});

export const cancel = catchAsync(async (req, res) => {
  const sub = await s.cancelSubscription(String(req.params.id), req.user!.id);
  res.json(new ApiResponse('Cancelled', sub));
});