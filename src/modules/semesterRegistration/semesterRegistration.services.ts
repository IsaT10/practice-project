import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import QueryBuilder from '../../builder/QueryBuilder';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { SemesterRegistration } from './semesterRegistration.model';
import mongoose from 'mongoose';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';

const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find(),
    query
  )
    .filter()
    .sort()
    .pagination()
    .fields();
  const result = await semesterRegistrationQuery.queryModel;
  return result;
};

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration
) => {
  const academicSemester = payload?.academicSemester;

  //check if there is any registered semester already 'ONGOING' | 'UPCOMING'
  const isAnyUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
    $or: [{ status: 'ONGOING' }, { status: 'UPCOMING' }],
  });

  if (isAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isAnyUpcomingOrOngoingSemester.status} registered semester`
    );
  }

  const isAcademicSemesterExists = await AcademicSemester.findById(
    academicSemester
  );
  //checke if academic semester is exists
  if (!isAcademicSemesterExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This academis semester not found!'
    );
  }

  const isSemesterRegistration = await SemesterRegistration.findOne({
    academicSemester,
  });
  // check if semester is alreday registered
  if (isSemesterRegistration) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This semester is already registered!'
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration not found');
  }
  return result;
};

const updateSemesterRegistrationInDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>
) => {
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  //if semester registration is exists

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This semester registration is not found !'
    );
  }

  const currentSemesterStatus = isSemesterRegistrationExists.status;
  const requestedSemesterStatus = payload?.status;
  //if semester registration status is "ENDED", we will not update
  if (currentSemesterStatus === 'ENDED') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already ${currentSemesterStatus}`
    );
  }

  if (
    currentSemesterStatus === 'UPCOMING' &&
    requestedSemesterStatus === 'ENDED'
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedSemesterStatus}`
    );
  }

  if (
    currentSemesterStatus === 'ONGOING' &&
    requestedSemesterStatus === 'UPCOMING'
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not change status from ${currentSemesterStatus} to ${requestedSemesterStatus}`
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration not found!'
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deleteOfferedCourseFromSemester = await OfferedCourse.deleteMany({
      semesterRegistration: id,
    });

    if (!deleteOfferedCourseFromSemester) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Can not delete releted offered course!'
      );
    }

    const result = await SemesterRegistration.findByIdAndDelete(id);

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete semester registration!'
    );
  }
};

export {
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationInDB,
  createSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
