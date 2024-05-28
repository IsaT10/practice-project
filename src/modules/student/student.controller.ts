import { NextFunction, Request, RequestHandler, Response } from 'express';
import {
  deleteStudentFromDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
} from './student.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

const getStudents = catchAsync(async (req, res) => {
  const students = await getAllStudentFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: students,
    success: true,
    message: 'Students are retrived successfully',
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const student = await getSingleStudentFromDB(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: student,
    success: true,
    message: 'Student is retrived successfully',
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await deleteStudentFromDB(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Student is deleted successfully',
  });
});

export { getStudents, getSingleStudent, deleteStudent };
