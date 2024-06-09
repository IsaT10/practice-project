import express from 'express';
import {
  assignFaculties,
  createCourse,
  deleteCourse,
  getCourses,
  getSingleCourse,
  removeFaculties,
  updateCourse,
} from './course.controller';
import validateRequest from '../../middleware/validateRequest';
import {
  CourseFacultyValidationSchema,
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
router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseFacultyValidationSchema),
  assignFaculties
);

router.delete('/:courseId/remove-faculties', removeFaculties);

export default router;
