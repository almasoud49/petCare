import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodIssue } from 'zod';

export const validate =
  (schema: ZodTypeAny) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const msg = result.error.issues
        .map((e: ZodIssue) => `${e.path.join('.')}: ${e.message}`)
        .join(' | ');
      return next({ statusCode: 400, message: msg });
    }
    next();
  };