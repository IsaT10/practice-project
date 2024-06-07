import express from 'express';
import {
  deleteAdmin,
  getAdmins,
  getSingleAdmin,
  updateAdmin,
} from './admin.controller';

const router = express.Router();

router.get('/', getAdmins);
router.get('/:id', getSingleAdmin);
router.delete('/:id', deleteAdmin);
router.patch('/:id', updateAdmin);

export default router;
