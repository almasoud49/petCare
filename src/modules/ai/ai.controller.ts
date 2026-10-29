import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as aiService from './ai.service';

export const chat = catchAsync(async (req: Request, res: Response) => {
  const { sessionId, message } = req.body;
  const answer = await aiService.chatWithAssistant(sessionId, message, req.user?.id);
  res.json(new ApiResponse('AI reply', { reply: answer }));
});

export const suggest = catchAsync(async (req: Request, res: Response) => {
  const suggestions = await aiService.suggestSearch(String(req.query.q));
  res.json(new ApiResponse('Suggestions', suggestions));
});

export const recommendations = catchAsync(async (req: Request, res: Response) => {
  const data = await aiService.getPersonalizedRecommendations(req.user?.id);
  res.json(new ApiResponse('Recommendations', data));
});

export const trending = catchAsync(async (_req: Request, res: Response) => {
  const data = await aiService.getTrendingServices();
  res.json(new ApiResponse('Trending services', data));
});

export const blogIdeas = catchAsync(async (req: Request, res: Response) => {
  const data = await aiService.generateBlogIdeas(req.body.topic);
  res.json(new ApiResponse('Blog ideas', data));
});