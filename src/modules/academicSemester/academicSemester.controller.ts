import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterInDB,
} from './academicSemester.services';

const createAcademicSemester = catchAsync(async (req, res) => {
  const newSemester = await createAcademicSemesterIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: newSemester,
    success: true,
    message: 'Academic semester is created successfully',
  });
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await getAllAcademicSemesterFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Academic semesters are retrived  successfully',
  });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await getSingleAcademicSemesterFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Academic semesters are retrived  successfully',
  });
});

const updateAcademicSemester = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await updateAcademicSemesterInDB(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: result,
    success: true,
    message: 'Academic semesters is updated successfully',
  });
});

export {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
