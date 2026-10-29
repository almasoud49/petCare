// cart.controller.ts
import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as cartService from './cart.service';

export const get = catchAsync(async (req, res) => {
  res.json(new ApiResponse('Cart', await cartService.getOrCreateCart(req.user!.id)));
});

export const add = catchAsync(async (req, res) => {
  const { productId, variantSku, quantity } = req.body;
  const cart = await cartService.addToCart(req.user!.id, productId, variantSku, quantity);
  res.json(new ApiResponse('Added to cart', cart));
});

export const update = catchAsync(async (req, res) => {
  const cart = await cartService.updateCartItem(req.user!.id, String(req.params.itemId), req.body.quantity);
  res.json(new ApiResponse('Cart updated', cart));
});

export const remove = catchAsync(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user!.id, String(req.params.itemId));
  res.json(new ApiResponse('Removed', cart));
});

export const applyCoupon = catchAsync(async (req, res) => {
  const cart = await cartService.applyCoupon(req.user!.id, req.body.code);
  res.json(new ApiResponse('Coupon applied', cart));
});

export const removeCoupon = catchAsync(async (req, res) => {
  const cart = await cartService.removeCoupon(req.user!.id);
  res.json(new ApiResponse('Coupon removed', cart));
});

export const clear = catchAsync(async (req, res) => {
  const cart = await cartService.clearCart(req.user!.id);
  res.json(new ApiResponse('Cart cleared', cart));
});