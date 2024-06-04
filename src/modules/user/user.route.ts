import express from 'express';
import { createFaculty, createStudent } from './user.controller';
import { CreateStudentValidationSchema } from '../student/student.validation.schema';
import validateRequest from '../../middleware/validateRequest';
import { CreateFacultyValidationSchema } from '../faculty/faculty.validation.schema';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(CreateStudentValidationSchema),
  createStudent
);
router.post(
  '/create-faculty',
  validateRequest(CreateFacultyValidationSchema),
  createFaculty
);
// router.route('/').post(createStudent);

export default router;
