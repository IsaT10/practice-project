import httpStatus from 'http-status';
import { getSingleAcademicSemesterFromDB } from '../academicSemester/academicSemester.services';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import mongoose from 'mongoose';
import AppError from '../../errors/appError';
import handleDuplicateError from '../../errors/handleDuplicateError';
import handleValidationError from '../../errors/handleValidationError';
import { Faculty } from '../faculty/faculty.model';
import { TFaculty } from '../faculty/faculty.interface';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent
) => {
  const user: Partial<TUser> = {};

  user.password = password || (process.env.DEFAULT_PASSWORD as string);
  user.role = 'student';
  user.email = payload.email;

  // find academic semester info
  const admissionSemester = await getSingleAcademicSemesterFromDB(
    payload.admissionSemester
  );

  if (!admissionSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Semester not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    user.id = await generateStudentId(admissionSemester);

    //  check if user is Exists
    const isUserExists = await User.findOne({ id: user.id });
    if (isUserExists) {
      throw new Error('User already exists');
    }

    const path = file?.path;
    const imgName = `${user.id}-${payload?.name?.firstName}`;

    //send image to cloudinary
    const data = await sendImageToCloudinary(path, imgName);
    if (data) {
      payload.profileImg = data.secure_url;
    }

    // create a user (transaction-1)
    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user!');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // create a student (transaction-2)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student!');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    console.log(error);

    if (error?.name === 'ValidationError') {
      throw handleValidationError(error);
    }

    if (error.code === 11000) {
      throw handleDuplicateError(error);
    }

    // Handle any other types of errors
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty
) => {
  const user: Partial<TUser> = {};

  user.password = password || (process.env.DEFAULT_PASSWORD as string);
  user.role = 'faculty';
  user.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    user.id = await generateFacultyId();

    //  check if user is Exists
    // const userInstance = new User(user);
    // if (await userInstance.isUserExists(user.id)) {
    //   throw new Error('User already exists');
    // }

    const isUserExists = await User.findOne({ id: user.id });
    if (isUserExists) {
      throw new Error('User already exists');
    }

    const path = file?.path;
    const imgName = `${user.id}-${payload?.name?.firstName}`;

    //send image to cloudinary
    const data = await sendImageToCloudinary(path, imgName);
    if (data) {
      payload.profileImg = data.secure_url;
    }

    // create a user (transaction-1)
    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user!');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // create a student (transaction-2)
    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty!');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    if (error?.name === 'ValidationError') {
      throw handleValidationError(error);
    }

    if (error.code === 11000) {
      throw handleDuplicateError(error);
    }

    // Handle any other types of errors
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create faculty!'
    );
  }
};

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  const user: Partial<TUser> = {};

  user.password = password || process.env.DEFAULT_PASSWORD;
  user.role = 'admin';
  user.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //set  generated id
    user.id = await generateAdminId();

    const newUser = await User.create([user], { session });

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newAdmin = await Admin.create([payload], { session });

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    console.log(error);

    if (error?.name === 'ValidationError') {
      throw handleValidationError(error);
    }

    if (error?.code === 11000) {
      throw handleDuplicateError(error);
    }

    // Handle any other types of errors
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create admin!'
    );
  }
};

const getMeFromDB = async (id: string, role: string) => {
  let result;

  if (role === 'student') {
    result = await Student.findOne({ id }).populate('user');
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id }).populate('user');
  }
  if (role === 'faculty') {
    result = await Faculty.findOne({ id }).populate('user');
  }

  return result;
};

const changeUserStatus = async (id: string, status: string) => {
  const result = await User.findByIdAndUpdate(id, { status }, { new: true });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

export {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMeFromDB,
  changeUserStatus,
};

//  statics methods
//   if (await Student.isUserExists(student.id)) {
//     throw new Error('User already exists');
//   }
// ------------ instance methods
// const studentInstance = new Student(student);
// if (await studentInstance.isUserExists(student.id)) {
//   throw new Error('User already exists');
// }
// const result = await studentInstance.save();
