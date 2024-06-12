import express from 'express';
import {
  deleteStudent,
  getSingleStudent,
  getStudents,
  updateStudent,
} from './student.controller';
import { auth } from '../../middleware/auth';

const router = express.Router();

router.get('/', auth('admin', 'student'), getStudents);
router.get('/:id', auth('admin', 'student'), getSingleStudent);
router.delete('/:id', deleteStudent);
router.patch('/:id', updateStudent);

export default router;
