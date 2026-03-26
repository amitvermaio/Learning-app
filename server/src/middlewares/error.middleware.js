import AppError from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const notFound = (req, res, next) => {
  next(new AppError(`Not Found - ${req.originalUrl}`, 404));
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json(new ApiResponse(
    status,
    null,
    err.message || 'Internal Server Error'
  ))
};