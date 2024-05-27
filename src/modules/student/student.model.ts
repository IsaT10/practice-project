import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';

// const capitalizeFirstLetter = (str: string) => {
//   if (!str) return str;
//   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// };

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

// we can also change provided name with our priority if we dont want to validate

// UserNameSchema.pre('save', function (next) {
//   this.firstName = capitalizeFirstLetter(this.firstName);
//   if (this.middleName) {
//     this.middleName = capitalizeFirstLetter(this.middleName);
//   }
//   this.lastName = capitalizeFirstLetter(this.lastName);
//   next();
// });

const GuardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: [true, "Father's name is required."] },
  fatherOccupation: {
    type: String,
    required: [true, "Father's occupation is required."],
  },
  fatherContactNo: {
    type: String,
    required: [true, "Father's contact number is required."],
  },
  motherName: { type: String, required: [true, "Mother's name is required."] },
  motherOccupation: {
    type: String,
    required: [true, "Mother's occupation is required."],
  },
  motherContactNo: {
    type: String,
    required: [true, "Mother's contact number is required."],
  },
});

const LocalGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, "Local guardian's name is required."],
  },
  occupation: {
    type: String,
    required: [true, "Local guardian's occupation is required."],
  },
  contactNo: {
    type: String,
    required: [true, "Local guardian's contact number is required."],
  },
  address: {
    type: String,
    required: [true, "Local guardian's address is required."],
  },
});

const StudentSchema = new Schema<TStudent, StudentModel>({
  id: { type: String, required: [true, 'Student ID is required.'] },
  name: { type: UserNameSchema, required: [true, 'Name is required'] },
  password: { type: String, required: [true, 'Password is required'] },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female'],
      message:
        "The gender field can only be one of the following: 'male', 'female' or 'other'.",
    },
    required: true,
  },
  dateOfBirth: { type: String, required: [true, 'Date of Birth is required.'] },
  email: {
    type: String,
    required: [true, 'Please enter a valid email address.'],
    // validate: {
    //   validator: (value: string) => validator.isEmail(value),
    //   message: 'Provide a valid email.',
    // },
  },
  contactNo: { type: String, required: [true, 'Contact number is required.'] },
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
  parmanentAddress: {
    type: String,
    required: [true, 'Permanent address is required.'],
  },
  guardian: {
    type: GuardianSchema,
    required: [true, 'Guardian information is required.'],
  },
  localGuardian: {
    type: LocalGuardianSchema,
    required: [true, 'Local guardian information is required.'],
  },
  profileImg: String,
  isActive: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
});

// for static methods

StudentSchema.statics.isUserExists = async function (id: string) {
  const result = await Student.findOne({ id });
  return result;
};

// for instance methods

// StudentSchema.methods.isUserExists = async function (id: string) {
//   const result = await Student.findOne({ id });
//   return result;
// };

// pre save middleware hook will be work on save() and create() method
StudentSchema.pre('save', async function (next) {
  const user = this;

  const hashPassword = await bcrypt.hash(
    user.password,
    Number(process.env.SALT_ROUNDS)
  );

  user.password = hashPassword;

  next();
});

StudentSchema.pre('find', async function (next) {
  this.find({ isDelete: { $ne: true } });

  next();
});

export const Student = model<TStudent, StudentModel>('Student', StudentSchema);
