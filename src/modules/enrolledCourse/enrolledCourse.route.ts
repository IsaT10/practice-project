import express from 'express';

import validateRequest from '../../middleware/validateRequest';
import { CreateEnrolledCourseValidationSchema } from './enrolledCourse.validation';
import { createEnrolledCourse } from './enrolledCourse..controller';
import { auth } from '../../middleware/auth';

const router = express.Router();

router.post(
  '/create-enrolled-course',
  auth('student'),
  validateRequest(CreateEnrolledCourseValidationSchema),

  createEnrolledCourse
);

export default router;
