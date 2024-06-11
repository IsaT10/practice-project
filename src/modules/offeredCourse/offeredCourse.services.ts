import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Faculty } from '../faculty/faculty.model';
import { Course } from '../course/course.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { hasTimeConflict } from './offeredCourse.utils';

const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .pagination()
    .fields();
  const result = await offeredCourseQuery.queryModel;
  return result;
};

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    faculty,
    course,
    academicDepartment,
    academicFaculty,
    section,
    days,
    startTime,
    endTime,
    semesterRegistration,
  } = payload;

  const isSemesterRegistrationExists = await SemesterRegistration.findById(
    semesterRegistration
  );
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration not found!'
    );
  }

  if (isSemesterRegistrationExists.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already ${isSemesterRegistrationExists.status}`
    );
  }

  const academicSemester = isSemesterRegistrationExists.academicSemester;

  const isAcademicFacultyExists = await AcademicFaculty.findById(
    academicFaculty
  );
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic faculty not found!');
  }

  const isAcademicDepartmentExists = await AcademicDepartment.findById(
    academicDepartment
  );
  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found!');
  }

  const isCourseExists = await Course.findById(course);
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found!');
  }

  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }

  // check if the department is belong to the  faculty
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${isAcademicDepartmentExists.name} is not belong to ${isAcademicFacultyExists.name}`
    );
  }

  // check if the same offered course same section in same registered semester exists

  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course with same section is already exist!`
    );
  }

  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedules = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedules)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This faculty is not available at that time ! Choose other time or day`
    );
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found');
  }
  return result;
};

const updateOfferedCourseInDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>
) => {
  const { faculty, days, startTime, endTime } = payload;

  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found!');
  }

  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  const semesterStatus = await SemesterRegistration.findById(
    semesterRegistration
  );

  if (semesterStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `This semester is already ${semesterStatus?.status}`
    );
  }

  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedules = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedules)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This faculty is not available at that time ! Choose other time or day`
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the semester registration status is upcoming
   * Step 3: delete the offered course
   */
  const isOfferedCourseExists = await OfferedCourse.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
  }

  const semesterRegistation = isOfferedCourseExists.semesterRegistration;

  const semesterRegistrationStatus = await SemesterRegistration.findById(
    semesterRegistation
  ).select('status');

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course can not update ! because the semester ${semesterRegistrationStatus}`
    );
  }

  const result = await OfferedCourse.findByIdAndDelete(id);

  return result;
};

export {
  getSingleOfferedCourseFromDB,
  updateOfferedCourseInDB,
  createOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
};
