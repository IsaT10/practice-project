import express from 'express';

import validateRequest from '../../middleware/validateRequest';
import {
  createSemesterRegistration,
  getSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
} from './semesterRegistration.controller';
import {
  CreateSemesterRegistrationValidationSchema,
  UpddateSemesterRegistrationValidationSchema,
} from './semesterRegistration.validation.schema';
import { UpdateAcademicSemesterSchemaValidation } from '../academicSemester/academicSemester.validation';

const router = express.Router();

router.get('/', getSemesterRegistrations);
router.post(
  '/create-semester-registration',
  validateRequest(CreateSemesterRegistrationValidationSchema),
  createSemesterRegistration
);
router.get('/:id', getSingleSemesterRegistration);
// router.delete('/:id', deleteFaculty);
router.patch(
  '/:id',
  validateRequest(UpddateSemesterRegistrationValidationSchema),
  updateSemesterRegistration
);

export default router;
