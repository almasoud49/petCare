import { User } from './user.model';
import { ApiError } from '../../utils/ApiError';
import { getPagination } from '../../utils/pagination';
import { UpdateUserInput } from './user.interface';
import bcrypt from 'bcryptjs';

export const getUserProfile = async (id: string) => {
  const user = await User.findById(id).lean();
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const updateUserProfile = async (id: string, updates: UpdateUserInput) => {
  const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const changePassword = async (
  id: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await User.findById(id).select('+password');
  if (!user || !(await user.comparePassword(currentPassword)))
    throw new ApiError(401, 'Current password incorrect');

  user.password = newPassword;
  await user.save();
};

export const listUsers = async (q: {
  page?: string;
  limit?: string;
  search?: string;
  role?: string;
}) => {
  const { page, limit, skip } = getPagination(q.page, q.limit);
  const filter: any = {};
  if (q.search) filter.$or = [
    { name: new RegExp(q.search, 'i') },
    { email: new RegExp(q.search, 'i') },
  ];
  if (q.role) filter.role = q.role;

  const [data, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const toggleUserStatus = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found');
  user.isActive = !user.isActive;
  await user.save();
  return user;
};

export const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApiError(404, 'User not found');
};