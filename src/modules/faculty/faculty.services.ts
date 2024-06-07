import mongoose from 'mongoose';
import { Faculty } from './faculty.model';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TFaculty } from './faculty.interface';
import AppError from '../../errors/appError';
import QueryBuilder from '../../builder/QueryBuilder';

const getAllFacultyFromDB = async (query: Record<string, unknown>) => {
  const searchFields = ['email', 'presentAddress', 'name.firstName'];

  const facultyQuery = new QueryBuilder(
    Faculty.find().populate({
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

  const result = await facultyQuery.queryModel;
  return result;
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findById(id).populate({
    path: 'academicDepartment',
    populate: { path: 'academicFaculty' },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty does not exists');
  }
  return result;
};

const updateFacultyInDB = async (id: string, payload: Partial<TFaculty>) => {
  const isValidUser = await Faculty.findById(id);
  if (!isValidUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty does not exists');
  }

  const { name, ...remainingFacultyFields } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyFields,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteFacultyFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  const isValidFaculty = await Faculty.findById(id);
  if (!isValidFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty does not exists');
  }
  try {
    session.startTransaction();

    const deleteFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deleteFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty!');
    }

    const userId = deleteFaculty.user;

    console.log(userId);

    const isValidUser = await User.findById(userId);
    if (!isValidUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User does not exists');
    }

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

    return deleteFaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export {
  getAllFacultyFromDB,
  getSingleFacultyFromDB,
  deleteFacultyFromDB,
  updateFacultyInDB,
};
