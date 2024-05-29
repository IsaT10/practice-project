import express from 'express';
import {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
} from './academicSemester.controller';
import validateRequest from '../../middleware/validateRequest';
import {
  CreateAcademicSemesterSchemaValidation,
  UpdateAcademicSemesterSchemaValidation,
} from './academicSemester.validation';

const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(CreateAcademicSemesterSchemaValidation),
  createAcademicSemester
);

router.get('/', getAllAcademicSemester);
router.get('/:id', getSingleAcademicSemester);
router.patch(
  '/:id',
  validateRequest(UpdateAcademicSemesterSchemaValidation),
  updateAcademicSemester
);

export default router;
