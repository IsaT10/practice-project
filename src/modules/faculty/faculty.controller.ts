import { NextFunction, Request, RequestHandler, Response } from 'express';
import {
  deleteFacultyFromDB,
  getAllFacultyFromDB,
  getSingleFacultyFromDB,
  updateFacultyInDB,
} from './faculty.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

const getFaculties = catchAsync(async (req, res) => {
  const faculties = await getAllFacultyFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: faculties,
    success: true,
    message: 'Faculties are retrived successfully',
  });
});

const getSingleFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const faculty = await getSingleFacultyFromDB(facultyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: faculty,
    success: true,
    message: 'Faculty is retrived successfully',
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;

  const { faculty } = req.body;
  const result = await updateFacultyInDB(facultyId, faculty);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Faculty is updated successfully',
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await deleteFacultyFromDB(facultyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Faculty is deleted successfully',
  });
});

export { getFaculties, getSingleFaculty, deleteFaculty, updateFaculty };
