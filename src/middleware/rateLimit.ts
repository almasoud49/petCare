import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many attempts, try again later',
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: 'Too many AI requests, slow down',
});