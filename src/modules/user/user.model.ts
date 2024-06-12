import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangeAt: Date,
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
      required: true,
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// pre save middleware hook will be work on save() and create() method
userSchema.pre('save', async function (next) {
  const user = this;

  const hashPassword = await bcrypt.hash(
    user.password,
    Number(process.env.SALT_ROUNDS)
  );

  user.password = hashPassword;

  next();
});

userSchema.statics.isValidUser = async function (id: string) {
  const isUserExists = await User.findOne({ id }).select('+password');
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const isUserDeleted = isUserExists.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted!');
  }

  const isUserBlocked = isUserExists.status;
  if (isUserBlocked === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already blocked!');
  }

  return isUserExists;
};

userSchema.statics.isPasswordMatch = async function (
  plainPassword: string,
  hashPassword: string
) {
  return await bcrypt.compare(plainPassword, hashPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChange = function (
  changePasswordTimestamp: Date,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(changePasswordTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

// for instance methods

// userSchema.methods.isUserExists = async function (id: string) {
//   const result = await User.findOne({ id });
//   return result;
// };

export const User = model<TUser, UserModel>('User', userSchema);
