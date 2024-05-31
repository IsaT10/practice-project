import express from 'express';

import validateRequest from '../../middleware/validateRequest';
import {
  CreateAcademicDepartmentSchemaValidation,
  UpdateAcademicDepartmentSchemaValidation,
} from './academicDepartment.validation';
import {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
} from './academicDepartment..controller';

const router = express.Router();

router.post(
  '/create-academic-department',
  validateRequest(CreateAcademicDepartmentSchemaValidation),

  createAcademicDepartment
);

router.get('/', getAllAcademicDepartment);
router.get('/:id', getSingleAcademicDepartment);
router.patch(
  '/:id',
  validateRequest(UpdateAcademicDepartmentSchemaValidation),
  updateAcademicDepartment
);

export default router;
