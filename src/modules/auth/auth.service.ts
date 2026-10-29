import { User } from '../user/user.model';
import { ApiError } from '../../utils/ApiError';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt';

const buildTokens = (id: string, role: string) => ({
  accessToken: signAccessToken({ id, role }),
  refreshToken: signRefreshToken({ id, role }),
});

const sanitize = (u: any) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  avatar: u.avatar,
});

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new ApiError(400, 'Email already registered');

  const user = await User.create(data);
  return { user: sanitize(user), ...buildTokens(user.id, user.role) };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password)))
    throw new ApiError(401, 'Invalid credentials');
  return { user: sanitize(user), ...buildTokens(user.id, user.role) };
};

export const refreshTokens = async (token: string) => {
  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, 'User not found');
  return buildTokens(user.id, user.role);
};

export const googleLogin = async (profile: {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
}) => {
  let user = await User.findOne({
    $or: [{ googleId: profile.googleId }, { email: profile.email }],
  });
  if (!user) user = await User.create({ ...profile, role: 'user' });
  return { user: sanitize(user), ...buildTokens(user.id, user.role) };
};

export const demoLogin = async () => {
  const email = 'demo@petcare.com';
  let user = await User.findOne({ email });
  if (!user)
    user = await User.create({
      name: 'Demo User',
      email,
      password: 'demo1234',
      role: 'user',
    });
  return { user: sanitize(user), ...buildTokens(user.id, user.role) };
};