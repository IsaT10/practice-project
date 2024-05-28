import express from 'express';
import { createStudent } from './user.controller';
import { CreateStudentValidationSchema } from '../student/student.validation.schema';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(CreateStudentValidationSchema),
  createStudent
);
// router.route('/').post(createStudent);

export default router;
