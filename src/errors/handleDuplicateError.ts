import httpStatus from 'http-status';
import AppError from '../utils/appError';

const handleDuplicateError = (err: any) => {
  const values = Object.values(err.keyValue);
  const message = `Duplicate field value "${values.join(
    ' '
  )}". Use another value!`;

  return new AppError(httpStatus.BAD_REQUEST, message);
};

export default handleDuplicateError;
