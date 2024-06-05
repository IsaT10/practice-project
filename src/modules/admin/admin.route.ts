import express from 'express';
import {
  deleteAdmin,
  getAdmins,
  getSingleAdmin,
  updateAdmin,
} from './admin.controller';

const router = express.Router();

router.get('/', getAdmins);
router.get('/:adminId', getSingleAdmin);
router.delete('/:adminId', deleteAdmin);
router.patch('/:adminId', updateAdmin);

export default router;
