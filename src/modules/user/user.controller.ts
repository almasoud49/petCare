import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as userService from './user.service';

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserProfile(req.user!.id);
  res.json(new ApiResponse('Profile fetched', user));
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUserProfile(req.user!.id, req.body);
  res.json(new ApiResponse('Profile updated', user));
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  await userService.changePassword(
    req.user!.id,
    req.body.currentPassword,
    req.body.newPassword
  );
  res.json(new ApiResponse('Password changed', null));
});

export const listUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.listUsers(req.query);
  res.json(new ApiResponse('Users fetched', result.data, result.meta));
});

export const toggleStatus = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.toggleUserStatus(req.params.id as string);
  res.json(new ApiResponse('User status toggled', user));
});

export const removeUser = catchAsync(async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id as string);
  res.json(new ApiResponse('User deleted', null));
});