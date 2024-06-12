import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {
  changeUserPassword,
  loginUserDB,
  refreshTokenFromServer,
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

export { loginUser, changePassword, refreshToken };
