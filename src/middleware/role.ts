import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const restrictTo =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role))
      return next(new ApiError(403, 'Forbidden: insufficient permissions'));
    next();
  };