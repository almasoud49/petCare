import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as authService from './auth.service';
import { env } from '../../config/env';

const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const base = { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax' as const };
  res.cookie('accessToken', accessToken, { ...base, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...base, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  setCookies(res, result.accessToken, result.refreshToken);
  res.status(201).json(new ApiResponse('Registered', result));
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body.email, req.body.password);
  setCookies(res, result.accessToken, result.refreshToken);
  res.json(new ApiResponse('Logged in', result));
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  const tokens = await authService.refreshTokens(token);
  setCookies(res, tokens.accessToken, tokens.refreshToken);
  res.json(new ApiResponse('Token refreshed', tokens));
});

export const logout = catchAsync(async (_req: Request, res: Response) => {
  res.clearCookie('accessToken').clearCookie('refreshToken');
  res.json(new ApiResponse('Logged out', null));
});

export const googleAuth = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.googleLogin(req.body);
  setCookies(res, result.accessToken, result.refreshToken);
  res.json(new ApiResponse('Google login', result));
});

export const demo = catchAsync(async (_req: Request, res: Response) => {
  const result = await authService.demoLogin();
  setCookies(res, result.accessToken, result.refreshToken);
  res.json(new ApiResponse('Demo login', result));
});