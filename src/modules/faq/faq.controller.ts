import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as faqService from './faq.service';

export const list = catchAsync(async (_req: Request, res: Response) => {
  const faqs = await faqService.listFaqs();
  res.json(new ApiResponse('FAQs fetched', faqs));
});

export const create = catchAsync(async (req: Request, res: Response) => {
  const faq = await faqService.createFaq(req.body);
  res.status(201).json(new ApiResponse('FAQ created', faq));
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const faq = await faqService.updateFaq(req.params.id as string, req.body);
  res.json(new ApiResponse('FAQ updated', faq));
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  await faqService.deleteFaq(req.params.id as string);
  res.json(new ApiResponse('FAQ deleted', null));
});