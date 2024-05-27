import { NextFunction, Request, Response } from 'express';
import {
  deleteStudentFromDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
} from './student.services';
import StudentValidationSchema from './student.validation.schema';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const getStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const students = await getAllStudentFromDB();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      data: students,
      success: true,
      message: 'Students are retrived successfully',
    });
  } catch (err) {
    next(err);
  }
};

const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId } = req.params;
    const student = await getSingleStudentFromDB(studentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      data: student,
      success: true,
      message: 'Student is retrived successfully',
    });
  } catch (err) {
    next(err);
  }
};

const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId } = req.params;
    const result = await deleteStudentFromDB(studentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      data: result,
      success: true,
      message: 'Student is deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

export { getStudents, getSingleStudent, deleteStudent };
