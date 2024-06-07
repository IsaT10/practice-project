import mongoose from 'mongoose';
import { Student } from './student.model';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import AppError from '../../errors/appError';
import QueryBuilder from '../../builder/QueryBuilder';

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  // const queryObj: Record<string, unknown> = { ...query };

  // const excludeFileds = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

  // excludeFileds.forEach((el) => delete queryObj[el]);

  // console.log(query, queryObj);

  // let baseQuery = Student.find(queryObj);

  // if (query.searchTerm) {
  //   const searchTerm = query.searchTerm;
  //   const searchQuery = {
  //     $or: searchFields.map((field) => ({
  //       [field]: { $regex: searchTerm, $options: 'i' },
  //     })),
  //   };

  //   baseQuery = baseQuery.find(searchQuery);
  // }

  // if (query.sort) {
  //   baseQuery = baseQuery.sort(query.sort as string);
  // } else {
  //   baseQuery = baseQuery.sort('-createdAt');
  // }

  // if (query.fields) {
  //   const selectField = (query.fields as string).replace(',', ' ');
  //   console.log(selectField);
  //   baseQuery = baseQuery.select(selectField);
  // } else {
  //   baseQuery = baseQuery.select('-__v');
  // }

  // const limit = Number(query.limit) || 10;
  // const page = Number(query.page) || 1;

  // if (query.limit) {
  //   const skip = (page - 1) * limit;
  //   baseQuery = baseQuery.skip(skip).limit(limit);
  // }

  // const result = await baseQuery;
  const searchFields = ['email', 'presentAddress', 'name.firstName'];

  const studetQuery = new QueryBuilder(
    Student.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: { path: 'academicFaculty' },
      }),
    query
  )
    .filter()
    .search(searchFields)
    .sort()
    .pagination()
    .fields();

  const result = await studetQuery.queryModel;
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findById(id)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student does not exists');
  }
  return result;
};

const updateStudentInDB = async (id: string, payload: Partial<TStudent>) => {
  const isValidStudent = await Student.findById(id);
  if (!isValidStudent) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student does not exists');
  }

  const { name, localGuardian, guardian, ...remainingStudentFields } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentFields,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  console.log(modifiedUpdatedData);

  const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const isValidStudemt = await Student.findById(id);
  if (!isValidStudemt) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student does not exists');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deleteStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deleteStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student!');
    }

    const userId = deleteStudent.user;

    const deleteUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user!');
    }

    await session.commitTransaction();
    await session.endSession();

    return deleteStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete admin!'
    );
  }
};

export {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentInDB,
};
