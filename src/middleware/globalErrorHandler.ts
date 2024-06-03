import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { TErrorScources } from '../interface/error';
import handelZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../utils/appError';
import handleDuplicateError from '../errors/handleDuplicateError';
import handleCastError from '../errors/handleCastError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  let error = { ...err };
  error.message = err.message;

  if (err?.name === 'ValidationError') {
    error = handleValidationError(error);
  }

  if (err?.name === 'ZodError') {
    error = handelZodError(error);
  }

  if (err?.code === 11000) {
    error = handleDuplicateError(error);
  }

  if (err.name === 'CastError') {
    error = handleCastError(error);
  }

  const { statusCode, message, stack } = error;

  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      success: false,
      message: message,
      err,
      stack: stack || err.stack,
    });
  }

  if (process.env.NODE_ENV === 'production') {
    res.status(statusCode).json({
      success: false,
      message: message,
    });
  }
};

export default globalErrorHandler;
