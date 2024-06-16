import {
  changeUserStatus,
  createAdminIntoDB,
  createFacultyIntoDB,
  createStudentIntoDB,
  getMeFromDB,
} from './user.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const newStudent = await createStudentIntoDB(req.file, password, studentData);

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

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;

  const newAdmin = await getMeFromDB(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: newAdmin,
    success: true,
    message: 'Profile retrived successfully',
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const newAdmin = await changeUserStatus(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: newAdmin,
    success: true,
    message: 'Status changed successfully',
  });
});

export { createStudent, createFaculty, createAdmin, getMe, changeStatus };
