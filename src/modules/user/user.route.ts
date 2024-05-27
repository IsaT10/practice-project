import express from 'express';
import { createStudent } from './user.controller';

const router = express.Router();

router.post('/create-student', createStudent);
// router.route('/').post(createStudent);

export default router;
