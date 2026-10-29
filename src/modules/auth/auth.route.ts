import { Router } from 'express';
import * as authController from './auth.controller';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema, googleSchema } from './auth.validator';
import { authLimiter } from '../../middleware/rateLimit';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/google', authLimiter, validate(googleSchema), authController.googleAuth);
router.post('/demo', authLimiter, authController.demo);

export default router;