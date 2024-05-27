import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser>({
  id: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  needsPasswordChange: {
    type: Boolean,
    default: true,
  },
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
});

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

export const User = model<TUser>('User', userSchema);
