import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as blogService from './blog.service';

export const create = catchAsync(async (req: Request, res: Response) => {
  const blog = await blogService.createBlog(req.user!.id, req.body);
  res.status(201).json(new ApiResponse('Blog created', blog));
});

export const list = catchAsync(async (req: Request, res: Response) => {
  const result = await blogService.listBlogs(req.query as any);
  res.json(new ApiResponse('Blogs fetched', result.data, result.meta));
});

export const detail = catchAsync(async (req: Request, res: Response) => {
  const blog = await blogService.getBlogBySlug(String(req.params.slug));
  res.json(new ApiResponse('Blog detail', blog));
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const blog = await blogService.updateBlog(String(req.params.id), req.body);
  res.json(new ApiResponse('Blog updated', blog));
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  await blogService.deleteBlog(String(req.params.id));
  res.json(new ApiResponse('Blog deleted', null));
});