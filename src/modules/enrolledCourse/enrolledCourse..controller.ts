import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { createEnrolledCourseIntoDB } from './enrolledCourse.services';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const newStudent = await createEnrolledCourseIntoDB(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: newStudent,
    success: true,
    message: 'Enrolled course is successful',
  });
});

const updateEnrolledCourse = catchAsync(async (req, res) => {
  // const { id } = req.params;
  // const data = req.body;
  // const result = await updateAcademicFacultyInDB(id, data);
  // sendResponse(res, {
  //   statusCode: httpStatus.OK,
  //   data: result,
  //   success: true,
  //   message: 'Academic Faculty is updated successfully',
  // });
});

export { createEnrolledCourse, updateEnrolledCourse };
