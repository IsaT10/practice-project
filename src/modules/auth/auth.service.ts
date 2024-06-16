import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { User } from '../user/user.model';
import { TAuth } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createToken } from './authutils';
import { sendEmail } from '../../utils/sendEmail';
import { decodedToken } from '../../utils/decodedToken';

const loginUserDB = async (payload: TAuth) => {
  const validUser = await User.isValidUser(payload?.id);

  const isPasswordMatch = await User.isPasswordMatch(
    payload.password,
    validUser.password
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!');
  }

  const jwtPayload = { userId: validUser.id, role: validUser.role };

  const refreshToken = createToken(
    jwtPayload,
    process.env.JWT_REFRESH_SECRET as string,
    process.env.JWT_REFRESH_EXPIRES_IN as string
  );

  const accessToken = createToken(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as string,
    process.env.JWT_ACCESS_EXPIRES_IN as string
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: validUser.needsPasswordChange,
  };
};

const changeUserPassword = async (
  user: JwtPayload,
  paylod: { oldPassword: string; newPassword: string }
) => {
  const { userId, role } = user;

  if (paylod.newPassword === paylod.oldPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'New password have to be diffent from old password'
    );
  }

  const validUser = await User.isValidUser(userId);

  const isPasswordMatch = await User.isPasswordMatch(
    paylod.oldPassword,
    validUser.password
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old password do not matched!');
  }

  const newHashPassword = await bcrypt.hash(
    paylod.newPassword,
    Number(process.env.SALT_ROUNDS)
  );

  await User.findOneAndUpdate(
    { id: userId, role },
    {
      password: newHashPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    }
  );

  return null;
};

const refreshTokenFromServer = async (token: string) => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as JwtPayload;

  const { userId, iat } = decoded;

  // check is valid user
  const validUser = await User.isValidUser(userId);

  if (
    validUser?.passwordChangeAt &&
    User.isJWTIssuedBeforePasswordChange(
      validUser.passwordChangeAt,
      iat as number
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  const jwtPayload = { userId: validUser.id, role: validUser.role };

  const accessToken = createToken(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as string,
    process.env.JWT_ACCESS_EXPIRES_IN as string
  );

  return { accessToken };
};

const forgetPasswordInDB = async (userId: string) => {
  // check is valid user
  const user = await User.isValidUser(userId);

  const jwtPayload = { userId: user.id, role: user.role };

  const resetToken = createToken(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as string,
    '10m'
  );

  const resetLink = `${process.env.RESET_PASSWORD_UI_LINK}?id=${user.id}&token=${resetToken}`;

  sendEmail(user.email, resetLink);
  // console.log(resetLink);
};

const resetPasswordInDB = async (
  payload: { id: string; newPassword: string },
  token: string
) => {
  // check is valid user
  const user = await User.isValidUser(payload.id);

  const decoded = decodedToken(token, process.env.JWT_ACCESS_SECRET as string);

  if (decoded.userId !== user.id) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden');
  }

  const newHashPassword = await bcrypt.hash(
    payload.newPassword,
    Number(process.env.SALT_ROUNDS)
  );

  await User.findOneAndUpdate(
    { id: decoded.userId, role: decoded.role },
    {
      password: newHashPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    }
  );
};

export {
  loginUserDB,
  changeUserPassword,
  refreshTokenFromServer,
  forgetPasswordInDB,
  resetPasswordInDB,
};
