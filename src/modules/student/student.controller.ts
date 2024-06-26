import { NextFunction, Request, RequestHandler, Response } from 'express';
import {
  deleteStudentFromDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
  updateStudentInDB,
} from './student.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

const getStudents = catchAsync(async (req, res) => {
  console.log(req.cookies);

  const students = await getAllStudentFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: students,
    success: true,
    message: 'Students are retrived successfully',
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const student = await getSingleStudentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: student,
    success: true,
    message: 'Student is retrived successfully',
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { student } = req.body;
  const result = await updateStudentInDB(id, student);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Student is updated successfully',
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteStudentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Student is deleted successfully',
  });
});

export { getStudents, getSingleStudent, deleteStudent, updateStudent };
