import express from 'express';

import {
  createOfferedCourse,
  deleteOfferedCourse,
  getOfferedCourses,
  getSingleOfferedCourse,
  updateOfferedCourse,
} from './offeredCourse.controller';
import {
  CreateOfferedCourseValidationSchema,
  UpdateOfferedCourseValidationSchema,
} from './offeredCourse.validation.schema';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

router.get('/', getOfferedCourses);
router.post(
  '/create-offered-course',
  validateRequest(CreateOfferedCourseValidationSchema),
  createOfferedCourse
);
router.get('/:id', getSingleOfferedCourse);
// router.delete('/:id', deleteFaculty);
router.patch(
  '/:id',
  validateRequest(UpdateOfferedCourseValidationSchema),
  updateOfferedCourse
);

router.delete('/:id', deleteOfferedCourse);

export default router;
