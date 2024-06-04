import httpStatus from 'http-status';
import AppError from './appError';
import mongoose from 'mongoose';

const handleCastError = (err: mongoose.Error.CastError) => {
  const message = `Invalid ${err.path}:${err.value}`;

  return new AppError(httpStatus.BAD_REQUEST, message);
};

export default handleCastError;
