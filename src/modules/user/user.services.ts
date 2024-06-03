import httpStatus from 'http-status';
import { getSingleAcademicSemesterFromDB } from '../academicSemester/academicSemester.services';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import mongoose from 'mongoose';
import AppError from '../../utils/appError';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  const user: Partial<TUser> = {};

  user.password = password || (process.env.DEFAULT_PASSWORD as string);
  user.role = 'student';

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
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }

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
};

export { createStudentIntoDB };
