import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {
  changeUserPassword,
  forgetPasswordInDB,
  loginUserDB,
  refreshTokenFromServer,
  resetPasswordInDB,
} from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const data = await loginUserDB(req.body);

  const { refreshToken, accessToken, needsPasswordChange } = data;

  res.cookie('refreshToken', refreshToken, {
    secure: process.env.NODE_ENV === 'production' && true,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: { accessToken, needsPasswordChange },
    success: true,
    message: 'Login successfully',
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...password } = req.body;
  const data = await changeUserPassword(req.user, password);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: data,
    success: true,
    message: 'Successfully changed password',
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const data = await refreshTokenFromServer(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: data,
    success: true,
    message: 'Successfully changed password',
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const userId = req.body.id;
  const data = await forgetPasswordInDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: data,
    success: true,
    message: 'Generate a link successfully',
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers?.authorization?.split(' ')[1];
  const data = await resetPasswordInDB(req.body, token!);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: data,
    success: true,
    message: 'Generate a link successfully',
  });
});

export {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
