import mongoose, { Schema, model } from 'mongoose';
import { TUserName } from '../../interface/types';
import { TAdmin } from './admin.interface';
import { Gender } from './admin.constant';

const UserNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'First name is required.'],
    validate: {
      validator: function (value: string) {
        const regex = /^[A-Z][a-z]*$/;
        return regex.test(value);
      },
      message: '{VALUE} is not in proper name format.',
    },
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last name is required.'],
  },
});

const AdminSchema = new Schema<TAdmin>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    name: {
      type: UserNameSchema,
      required: [true, 'Name is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required.'],
      unique: true,
      ref: 'User',
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female'],
        message:
          "The gender field can only be one of the following: 'male', 'female' or 'other'.",
      },
      required: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: {
      type: String,
      required: [true, 'Contact number is required.'],
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required.'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message:
          "The blood group can only be one of the following: 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', or 'O-'.",
      },
      required: true,
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required.'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required.'],
    },

    profileImg: String,

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

AdminSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });

  next();
});

export const Admin = model<TAdmin>('Admin', AdminSchema);
