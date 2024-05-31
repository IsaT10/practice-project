import express from 'express';
import {
  createAcademicFaculty,
  getAllAcademicFaculty,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
} from './academicFaculty..controller';
import { AcademicFacultySchemaValidation } from './academicFaculty.validation';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  validateRequest(AcademicFacultySchemaValidation),

  createAcademicFaculty
);

router.get('/', getAllAcademicFaculty);
router.get('/:id', getSingleAcademicFaculty);
router.patch(
  '/:id',
  validateRequest(AcademicFacultySchemaValidation),
  updateAcademicFaculty
);

export default router;
