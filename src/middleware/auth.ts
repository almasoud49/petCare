import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { User } from '../modules/user/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;
    if (req.headers.authorization?.startsWith('Bearer'))
      token = req.headers.authorization.split(' ')[1];
    else if (req.cookies?.accessToken) token = req.cookies.accessToken;

    if (!token) throw new ApiError(401, 'Not authenticated');

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) throw new ApiError(401, 'User not found or inactive');

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (e: any) {
    next(new ApiError(401, e.message || 'Invalid token'));
  }
};