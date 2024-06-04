import mongoose from 'mongoose';
import { TErrorScources } from '../interface/error';
import httpStatus from 'http-status';
import AppError from './appError';

const handleValidationError = (err: mongoose.Error.ValidationError) => {
  let message = '';
  const errors = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      message = `${val?.path.toUpperCase()} is required`;
    }
  );

  return new AppError(httpStatus.BAD_REQUEST, message);
};
// const handleValidationError = (err: mongoose.Error.ValidationError) => {
//   const errorSources: TErrorScources = Object.values(err.errors).map(
//     (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
//       return {
//         path: val?.path,
//         message: `${val.path.toUpperCase()} is required.`,
//       };
//     }
//   );

//   const statusCode = 400;

//   return {
//     statusCode,
//     message: 'Validation Error',
//     errorSources,
//   };
// };

export default handleValidationError;
