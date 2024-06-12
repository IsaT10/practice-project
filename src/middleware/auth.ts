import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../errors/appError';
import httpStatus from 'http-status';
import { User } from '../modules/user/user.model';

export const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'no token provided');
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as JwtPayload;

    const { userId, role, iat } = decoded;

    // check is valid user
    const validUser = await User.isValidUser(userId);

    if (
      validUser?.passwordChangeAt &&
      User.isJWTIssuedBeforePasswordChange(
        validUser.passwordChangeAt,
        iat as number
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You do not have permission to perform this action'
      );
    }
    req.user = decoded;
    next();
  });
};
