import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export function zodValidate(schema: z.ZodSchema, type: 'body' | 'query' | 'params' = 'body') {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      req[type] = schema.parse(req[type]);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          data: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message
          })),
          message: 'zod validation error'
        });
      }

      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
}
