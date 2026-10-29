import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as serviceService from './service.service';

export const create = catchAsync(async (req: Request, res: Response) => {
  const service = await serviceService.createService(req.body);
  res.status(201).json(new ApiResponse('Service created', service));
});

export const list = catchAsync(async (req: Request, res: Response) => {
  const result = await serviceService.listServices(req.query as any);
  res.json(new ApiResponse('Services fetched', result.data, result.meta));
});

export const detail = catchAsync(async (req: Request, res: Response) => {
  const service = await serviceService.getServiceById(req.params.id as string);
  const related = await serviceService.getRelatedServices(req.params.id as string, service.category);
  res.json(new ApiResponse('Service detail', { service, related }));
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const service = await serviceService.updateService(req.params.id as string, req.body);
  res.json(new ApiResponse('Service updated', service));
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  await serviceService.deleteService(req.params.id as string);
  res.json(new ApiResponse('Service deleted', null));
});