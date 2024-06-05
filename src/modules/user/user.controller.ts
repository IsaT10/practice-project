import {
  createAdminIntoDB,
  createFacultyIntoDB,
  createStudentIntoDB,
} from './user.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const newStudent = await createStudentIntoDB(password, studentData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: newStudent,
    success: true,
    message: 'Student is created successfully',
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const newFaculty = await createFacultyIntoDB(password, facultyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: newFaculty,
    success: true,
    message: 'Faculty is created successfully',
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const newAdmin = await createAdminIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: newAdmin,
    success: true,
    message: 'Admin is created successfully',
  });
});

export { createStudent, createFaculty, createAdmin };
