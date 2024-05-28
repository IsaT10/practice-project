import express from 'express';
import { createAcademicSemester } from './academicSemester.controller';
import validateRequest from '../../middleware/validateRequest';
import { CreateAcademicSemesterSchemaValidation } from './academicSemester.validation';

const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(CreateAcademicSemesterSchemaValidation),
  createAcademicSemester
);

// router.get('/', getStudents);
// router.get('/:studentId', getSingleStudent);
// router.delete('/:studentId', deleteStudent);

export default router;
