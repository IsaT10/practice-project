import express from 'express';
import {
  deleteFaculty,
  getSingleFaculty,
  getFaculties,
  updateFaculty,
} from './faculty.controller';
import validateRequest from '../../middleware/validateRequest';
import { UpdateFacultyValidationSchema } from './faculty.validation.schema';

const router = express.Router();

router.get('/', getFaculties);
router.get('/:facultyId', getSingleFaculty);
router.delete('/:facultyId', deleteFaculty);
router.patch(
  '/:facultyId',
  validateRequest(UpdateFacultyValidationSchema),

  updateFaculty
);

export default router;
