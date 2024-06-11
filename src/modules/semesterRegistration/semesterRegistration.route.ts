import express from 'express';

import validateRequest from '../../middleware/validateRequest';
import {
  createSemesterRegistration,
  deleteSemesterRegistration,
  getSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
} from './semesterRegistration.controller';
import {
  CreateSemesterRegistrationValidationSchema,
  UpddateSemesterRegistrationValidationSchema,
} from './semesterRegistration.validation.schema';

const router = express.Router();

router.get('/', getSemesterRegistrations);
router.post(
  '/create-semester-registration',
  validateRequest(CreateSemesterRegistrationValidationSchema),
  createSemesterRegistration
);
router.get('/:id', getSingleSemesterRegistration);
router.patch(
  '/:id',
  validateRequest(UpddateSemesterRegistrationValidationSchema),
  updateSemesterRegistration
);

router.delete('/:id', deleteSemesterRegistration);

export default router;
