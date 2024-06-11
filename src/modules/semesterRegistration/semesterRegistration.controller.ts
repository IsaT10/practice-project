import { NextFunction, Request, RequestHandler, Response } from 'express';

import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import {
  createSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationInDB,
} from './semesterRegistration.services';

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

const getSemesterRegistrations = catchAsync(async (req, res) => {
  const semesterRegistrations = await getAllSemesterRegistrationFromDB(
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: semesterRegistrations,
    success: true,
    message: 'Semester Registrations are retrived successfully',
  });
});

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const semesterRegistration = await getSingleSemesterRegistrationFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: semesterRegistration,
    success: true,
    message: 'Semester Registration is retrived successfully',
  });
});
const createSemesterRegistration = catchAsync(async (req, res) => {
  const semesterRegistration = await createSemesterRegistrationIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: semesterRegistration,
    success: true,
    message: 'SemesterRegistration is retrived successfully',
  });
});

const updateSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updatedSemesterRegistration = await updateSemesterRegistrationInDB(
    id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: updatedSemesterRegistration,
    success: true,
    message: 'Semester Registration is updated successfully',
  });
});

const deleteSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updatedSemesterRegistration = await deleteSemesterRegistrationFromDB(
    id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: updatedSemesterRegistration,
    success: true,
    message: 'Semester Registration is deleted successfully',
  });
});

export {
  getSemesterRegistrations,
  getSingleSemesterRegistration,
  createSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
};
