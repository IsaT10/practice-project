import { Schema, model } from 'mongoose';
import { TUser, UserMethods, UserModel } from './user.interface';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser, UserModel, UserMethods>(
  {
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

// for instance methods

userSchema.methods.isUserExists = async function (id: string) {
  const result = await User.findOne({ id });
  return result;
};

export const User = model<TUser, UserModel>('User', userSchema);
