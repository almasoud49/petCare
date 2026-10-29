import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as orderService from './order.service';

export const place = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.placeOrder(req.user!.id, req.body);
  res.status(201).json(new ApiResponse('Order placed', order));
});

export const listMine = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.listUserOrders(req.user!.id, req.query);
  res.json(new ApiResponse('My orders', result.data, result.meta));
});

export const detailMine = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(String(req.params.id), req.user!.id);
  res.json(new ApiResponse('Order detail', order));
});

export const cancel = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.cancelOrder(String(req.params.id), req.user!.id);
  res.json(new ApiResponse('Order cancelled', order));
});

export const listAll = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.listAllOrders(req.query);
  res.json(new ApiResponse('All orders', result.data, result.meta));
});

export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.updateOrderStatus(
    String(req.params.id),
    req.body.status,
    req.body.trackingNumber
  );
  res.json(new ApiResponse('Order status updated', order));
});

export const detail = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(String(req.params.id));
  res.json(new ApiResponse('Order detail', order));
});