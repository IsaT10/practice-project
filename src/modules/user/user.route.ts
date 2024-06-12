import express from 'express';

import validateRequest from '../../middleware/validateRequest';
import { createAdmin, createFaculty, createStudent } from './user.controller';

import { CreateStudentValidationSchema } from '../student/student.validation.schema';
import { CreateFacultyValidationSchema } from '../faculty/faculty.validation.schema';
import { CreateAdminValidationSchema } from '../admin/admin.validation.schema';
import { auth } from '../../middleware/auth';

const router = express.Router();

router.post(
  '/create-student',
  auth('admin'),
  validateRequest(CreateStudentValidationSchema),
  createStudent
);

router.post(
  '/create-faculty',
  validateRequest(CreateFacultyValidationSchema),
  createFaculty
);

router.post(
  '/create-admin',
  validateRequest(CreateAdminValidationSchema),
  createAdmin
);
// router.route('/').post(createStudent);

export default router;
