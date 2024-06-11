import { NextFunction, Request, RequestHandler, Response } from 'express';

import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import {
  createOfferedCourseIntoDB,
  deleteOfferedCourseFromDB,
  getAllOfferedCourseFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseInDB,
} from './offeredCourse.services';

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

const getOfferedCourses = catchAsync(async (req, res) => {
  const offeredCourses = await getAllOfferedCourseFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: offeredCourses,
    success: true,
    message: 'Offered course are retrived successfully',
  });
});

const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const offeredCourse = await getSingleOfferedCourseFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: offeredCourse,
    success: true,
    message: 'Offered course is retrived successfully',
  });
});
const createOfferedCourse = catchAsync(async (req, res) => {
  const offeredCourse = await createOfferedCourseIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: offeredCourse,
    success: true,
    message: 'OfferedCourse is created successfully',
  });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updatedOfferedCourse = await updateOfferedCourseInDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: updatedOfferedCourse,
    success: true,
    message: 'Offered course is updated successfully',
  });
});

const deleteOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updatedOfferedCourse = await deleteOfferedCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: updatedOfferedCourse,
    success: true,
    message: 'Offered course is deleted successfully',
  });
});

export {
  getOfferedCourses,
  getSingleOfferedCourse,
  createOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
