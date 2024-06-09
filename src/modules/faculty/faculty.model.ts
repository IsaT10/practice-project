import { Schema, model } from 'mongoose';
import { TFaculty, TUserName } from './faculty.interface';

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

const FacultySchema = new Schema<TFaculty>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
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

    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic Faculty ID is required.'],
      ref: 'AcademicDepartment',
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

FacultySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });

  next();
});

// FacultySchema.pre('findOne', function (next) {
//   this.find({ isDeleted: { $ne: true } });
//   next();
// });

// FacultySchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
//   next();
// });

export const Faculty = model<TFaculty>('Faculty', FacultySchema);
