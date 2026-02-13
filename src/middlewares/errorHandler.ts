import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message);
    return;
  }

  // Log unexpected errors
  console.error('Unexpected Error:', err);

  sendError(res, 500, 'An unexpected error occurred');
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, 404, `Route ${req.originalUrl} not found`);
};
