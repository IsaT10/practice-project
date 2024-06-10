import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { TCourse, TCourseFaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import mongoose, { Types } from 'mongoose';
const { ObjectId } = Types;

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);

  return result;
};

const getAllCourseFromDB = async (query: Record<string, unknown>) => {
  const searchableFields = ['title', 'prefix'];

  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query
  )
    .filter()
    .search(searchableFields)
    .sort()
    .pagination()
    .fields();

  const result = await courseQuery.queryModel;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course'
  );

  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...remainingData } = payload;

  const isValidCourse = await Course.findById(id);
  if (!isValidCourse) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Course is not found!');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await Course.findByIdAndUpdate(id, remainingData, {
      new: true,
      runValidators: true,
      session,
    });
    // if (!updatedCourse) {
    //   throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    // }

    if (preRequisiteCourses && preRequisiteCourses?.length > 0) {
      const deletedPrerequisite = preRequisiteCourses
        ?.filter((el) => el.isDeleted === true)
        .map((el) => el.course);

      await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPrerequisite } },
          },
        },
        { new: true, session }
      );

      // if (!deletedPrerequisiteCourses) {
      //   throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      // }

      // -----------

      const newpreRequisiteCourses = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted
      );

      console.log({ newpreRequisiteCourses });

      await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newpreRequisiteCourses } },
        },
        { new: true, runValidators: true, session }
      );
    }

    await session.commitTransaction();
    await session.endSession();

    const result = await Course.findById(id).populate(
      'preRequisiteCourses.course'
    );

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  return result;
};

const assignFacultiesIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    { upsert: true, new: true }
  );

  return result;
};

const removeFacultiesFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    { new: true }
  );

  return result;
};

export {
  createCourseIntoDB,
  getAllCourseFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assignFacultiesIntoDB,
  removeFacultiesFromDB,
};
