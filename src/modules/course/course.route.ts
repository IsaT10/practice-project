import express from 'express';
import {
  createCourse,
  deleteCourse,
  getCourses,
  getSingleCourse,
  updateCourse,
} from './course.controller';
import validateRequest from '../../middleware/validateRequest';
import {
  CreateCoureValidaionSchema,
  UpdateCourseValidationSchema,
} from './course.validation.schema';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CreateCoureValidaionSchema),
  createCourse
);
router.get('/', getCourses);
router.get('/:id', getSingleCourse);
router.patch(
  '/:id',
  validateRequest(UpdateCourseValidationSchema),
  updateCourse
);
router.delete('/:id', deleteCourse);

export default router;
