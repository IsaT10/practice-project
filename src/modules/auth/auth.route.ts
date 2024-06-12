import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import {
  ChangePasswordValidationSchema,
  LoginValidationSchema,
  RefreshTokenValidationSchema,
} from './auth.validation';
import { changePassword, loginUser, refreshToken } from './auth.controller';
import { auth } from '../../middleware/auth';

const router = express.Router();

router.post('/login', validateRequest(LoginValidationSchema), loginUser);

router.post(
  '/change-password',
  auth('admin', 'student', 'faculty'),
  validateRequest(ChangePasswordValidationSchema),
  changePassword
);

router.post(
  '/refresh-token',
  validateRequest(RefreshTokenValidationSchema),
  refreshToken
);

export default router;
