import express from 'express';
import {
  deleteStudent,
  getSingleStudent,
  getStudents,
} from './student.controller';

const router = express.Router();

router.get('/', getStudents);
router.get('/:studentId', getSingleStudent);
router.delete('/:studentId', deleteStudent);

export default router;
