import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { searchFields } from './admin.constant';
import { Admin } from './admin.model';
import { TAdmin } from './admin.interface';
import mongoose from 'mongoose';
import { User } from '../user/user.model';
import handleValidationError from '../../errors/handleValidationError';
import handleDuplicateError from '../../errors/handleDuplicateError';

const getAllAdminFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .filter()
    .search(searchFields)
    .sort()
    .pagination()
    .fields();

  const result = await adminQuery.queryModel;
  return result;
};

const getSingleAdminFromDB = async (id: string) => {
  const result = await Admin.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin does not exists');
  }

  return result;
};

const updateAdminInDB = async (id: string, payload: Partial<TAdmin>) => {
  const isValidAdmin = await Admin.findById(id);
  if (!isValidAdmin) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin does not exists');
  }

  const { name, ...remainingUpdatedFields } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingUpdatedFields,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteAdminFromDB = async (id: string) => {
  const isValidAdmin = await Admin.findById(id);
  if (!isValidAdmin) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin does not exists');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deleteAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deleteAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Admin!');
    }

    const userId = deleteAdmin.user;

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

    return deleteAdmin;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    if (error?.name === 'ValidationError') {
      throw handleValidationError(error);
    }

    if (error?.code === 11000) {
      throw handleDuplicateError(error);
    }

    // Handle any other types of errors
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete admin!'
    );
  }
};

export {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateAdminInDB,
  deleteAdminFromDB,
};
