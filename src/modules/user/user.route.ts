import express, { NextFunction, Request, Response } from 'express';

import validateRequest from '../../middleware/validateRequest';
import {
  changeStatus,
  createAdmin,
  createFaculty,
  createStudent,
  getMe,
} from './user.controller';

import { CreateStudentValidationSchema } from '../student/student.validation.schema';
import { CreateFacultyValidationSchema } from '../faculty/faculty.validation.schema';
import { CreateAdminValidationSchema } from '../admin/admin.validation.schema';
import { auth } from '../../middleware/auth';
import { changeStatusValidationSchema } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/create-student',
  auth('admin'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(CreateStudentValidationSchema),

  createStudent
);

router.post(
  '/create-faculty',
  auth('admin'),
  validateRequest(CreateFacultyValidationSchema),
  createFaculty
);

router.post(
  '/create-admin',
  validateRequest(CreateAdminValidationSchema),
  createAdmin
);

router.patch(
  '/change-status/:id',
  auth('admin'),
  validateRequest(changeStatusValidationSchema),
  changeStatus
);

router.get('/me', auth('student', 'faculty', 'admin'), getMe);
// router.route('/').post(createStudent);

export default router;
