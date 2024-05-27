import { NextFunction, Request, Response } from 'express';
import { createStudentIntoDB } from './user.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, student: studentData } = req.body;

    const newStudent = await createStudentIntoDB(password, studentData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      data: newStudent,
      success: true,
      message: 'Student is created successfully',
    });
  } catch (err: any) {
    next(err);
  }
};

export { createStudent };
