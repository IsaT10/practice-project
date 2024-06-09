import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {
  assignFacultiesIntoDB,
  createCourseIntoDB,
  deleteCourseFromDB,
  getAllCourseFromDB,
  getSingleCourseFromDB,
  removeFacultiesFromDB,
  updateCourseIntoDB,
} from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const newCourse = await createCourseIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: newCourse,
    success: true,
    message: 'Course is created successfully',
  });
});

const getCourses = catchAsync(async (req, res) => {
  const courses = await getAllCourseFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: courses,
    success: true,
    message: 'Courses are retrived successfully',
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const course = await getSingleCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: course,
    success: true,
    message: 'Course is retrived successfully',
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Course is deleted successfully',
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updateCourseIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Course is updated successfully',
  });
});

const assignFaculties = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;

  const result = await assignFacultiesIntoDB(courseId, faculties);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Assign faculties  successfully',
  });
});

const removeFaculties = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;

  const result = await removeFacultiesFromDB(courseId, faculties);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Remove faculties  successfully',
  });
});

export {
  getCourses,
  getSingleCourse,
  deleteCourse,
  createCourse,
  updateCourse,
  assignFaculties,
  removeFaculties,
};
