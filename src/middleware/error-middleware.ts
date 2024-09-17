import { ApiError } from '@/utils/ApiError';
import { Request, Response, NextFunction } from 'express';

// @desc Handles error responses from throw errors

export const errorResponse = (error: ApiError | Error, _req: Request, res: Response, _next: NextFunction) => {
  if (!(error instanceof ApiError)) {
    res.status(500).json({
      success: false,
      //TODO: do environment check when it exists
      data: error.stack,
      message: 'internal server error'
    });

    console.log(error);

    return;
  }

  res.status(error.statusCode).json({
    success: false,
    data: error.data,
    message: error.message
  });
};
