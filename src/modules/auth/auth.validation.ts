import { z } from 'zod';

const LoginValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'Id is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const ChangePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old password is required.' }),
    newPassword: z
      .string({ required_error: 'New password is required.' })
      .min(8, 'Password can not be less than 8 character'),
  }),
});

const RefreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required!' }),
  }),
});

export {
  LoginValidationSchema,
  ChangePasswordValidationSchema,
  RefreshTokenValidationSchema,
};
