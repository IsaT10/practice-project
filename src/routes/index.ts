import { Router } from 'express';
import SutdentRouter from '../modules/student/student.route';
import UserRouter from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  { path: '/students', route: SutdentRouter },
  { path: '/users', route: UserRouter },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
