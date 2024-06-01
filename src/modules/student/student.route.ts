import express from 'express';
import {
  deleteStudent,
  getSingleStudent,
  getStudents,
  updateStudent,
} from './student.controller';

const router = express.Router();

router.get('/', getStudents);
router.get('/:studentId', getSingleStudent);
router.delete('/:studentId', deleteStudent);
router.patch('/:studentId', updateStudent);

export default router;
