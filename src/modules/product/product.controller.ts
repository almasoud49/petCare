import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as productService from './product.service';

export const create = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(new ApiResponse('Product created', product));
});

export const list = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.listProducts(req.query as any);
  res.json(new ApiResponse('Products fetched', result.data, result.meta));
});

export const detail = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getProductBySlug(String(req.params.slug));
  const related = await productService.getRelatedProducts(product);
  res.json(new ApiResponse('Product detail', { product, related }));
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(
    String(req.params.id),
    req.body
  );
  res.json(new ApiResponse('Product updated', product));
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  await productService.deleteProduct(String(req.params.id));
  res.json(new ApiResponse('Product deleted', null));
});

export const flashSale = catchAsync(async (_req: Request, res: Response) => {
  const data = await productService.getFlashSaleProducts();
  res.json(new ApiResponse('Flash sale products', data));
});

export const featured = catchAsync(async (_req: Request, res: Response) => {
  const data = await productService.getFeaturedProducts();
  res.json(new ApiResponse('Featured products', data));
});