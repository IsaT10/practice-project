import express from 'express';
import {
  deleteStudent,
  getSingleStudent,
  getStudents,
  updateStudent,
} from './student.controller';

const router = express.Router();

router.get('/', getStudents);
router.get('/:id', getSingleStudent);
router.delete('/:id', deleteStudent);
router.patch('/:id', updateStudent);

export default router;
